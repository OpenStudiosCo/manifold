import bpy

#@todo https://github.com/FHPythonUtils/SvgTrace

def setup_demo():
    bpy.data.objects['Cube'].select_set(True)
    bpy.ops.object.delete()
    bpy.ops.import_image.to_plane(files=[{"name":"demo2.jpg", "name":"demo2.jpg"}], directory="C:\\Users\\Paul\\Pictures\\", relative=False)
    for window in bpy.context.window_manager.windows:
        for area in window.screen.areas: # iterate through areas in current screen
            if area.type == 'VIEW_3D':
                for space in area.spaces: # iterate through spaces in current VIEW_3D area
                    if space.type == 'VIEW_3D': # check if space is a 3D view
                        space.shading.type = 'RENDERED'
    
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
        row.operator("render.render")


classes = (
    OBJECT_MT_sub_menu,
    OBJECT_PT_trace,
)


def register():
    from bpy.utils import register_class
    for cls in classes:
        register_class(cls)
    setup_demo()

def unregister():
    from bpy.utils import unregister_class
    for cls in reversed(classes):
        unregister_class(cls)


if __name__ == "__main__":
    register()
