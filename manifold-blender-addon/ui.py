import bpy

from pathlib import Path
from svgtrace import trace

class TraceOperator(bpy.types.Operator):
    bl_idname = 'manifold.trace'
    bl_label = 'Trace'
    bl_options = {'INTERNAL'}

    def execute(self, context):
        CURDIR = str(Path(__file__).resolve().parent.parent)
        print(CURDIR)

        filepath = bpy.data.images["shapes.png"].filepath_from_user()        
        svg = trace(filepath, mode = 'posterized3')
        #print(svg)
        
        tmpfile = f"{CURDIR}\\tmp.svg"
        print(tmpfile)

        Path(tmpfile).write_text(svg, encoding="utf-8")
        bpy.ops.import_curve.svg(filepath=tmpfile)
        scale = 10.
        for obj in bpy.data.collections['tmp.svg'].all_objects:
            obj.scale = ( scale, scale, scale)
            obj.rotation_euler[0] = 1.5708
            obj.rotation_euler[2] = 1.5708
            obj.location[1] = -0.8
            obj.location[2] = 0.5

        self.report({'INFO'}, "The custom operator actually worked!!!")
        return {'FINISHED'}

class OBJECT_MT_sub_menu(bpy.types.Menu):
    bl_label = "Imagetrace"
    bl_idname = "OBJECT_MT_sub_menu"

    def draw(self, context):
        layout = self.layout
        layout.label(text="Select the tracing framework (TBA)", icon='WORLD_DATA')
        
        # call another predefined menu
        layout.operator("object.select_random", text="Imagetrace")
        layout.operator("object.select_random", text="Potrace")

class OBJECT_PT_trace(bpy.types.Panel):
    """Creates a Panel in the object context of the properties editor"""
    bl_label = "Trace Options"
    bl_idname = "OBJECT_PT_trace"
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = "object"

    def draw(self, context):
        layout = self.layout

        scene = context.scene

        # Create a simple row.
        layout.label(text=" Framework:")
        layout.menu("OBJECT_MT_sub_menu", icon="COLLAPSEMENU")

        # Big render button
        layout.label(text="Big Button:")
        row = layout.row()
        row.scale_y = 3.0
        row.operator("manifold.trace")


classes = (
    TraceOperator,
    OBJECT_MT_sub_menu,
    OBJECT_PT_trace,

)

register, unregister = bpy.utils.register_classes_factory(classes)

if __name__ == "__main__":
    register()
