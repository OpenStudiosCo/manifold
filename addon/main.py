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

#in order to make a button do custom behavior we need to register and make an operator, a basic
#custom operator that does not take any property and just runs is easily made like so        
class TraceOperator(bpy.types.Operator):
    #the id variable by which we can invoke the operator in blender
    #usually its good practice to have SOMETHING.other_thing as style so we can group
    #many id's together by SOMETHING and we have less chance of overriding existing op's
    bl_idname = 'manifold.trace'
    #this is the label that essentially is the text displayed on the button
    bl_label = 'Trace'
    #these are the options for the operator, this one makes it not appear
    #in the search bar and only accessible by script, useful
    #NOTE: it's a list of strings in {} braces, see blender documentation on types.operator
    bl_options = {'INTERNAL'}

    #this is the cream of the entire operator class, this one's the function that gets
    #executed when the button is pressed
    def execute(self, context):
        #just do the logic here
        
        #this is a report, it pops up in the area defined in the word
        #in curly braces {} which is the first argument, second is the actual displayed text
        self.report({'INFO'}, "The custom operator actually worked!")
        #return value tells blender wether the operation finished sueccessfully
        #needs to be in curly braces also {}
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


def register():
    from bpy.utils import register_class
    for cls in classes:
        register_class(cls)
#    setup_demo()

def unregister():
    from bpy.utils import unregister_class
    for cls in reversed(classes):
        unregister_class(cls)
