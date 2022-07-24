import bpy

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
