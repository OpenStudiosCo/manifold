#this is the addon info for when you choose to install it
#NOTE: for more information, see addon tutorial in the documentation
bl_info={
        "name":"Manifold",
        "version": (1, 0),
        "category":"Object",
        "description": "Bitmap to Vector Add-on",
        "author": "Paul Brzeski",
        "version": (1, 0),
        "blender": (2, 80, 0),
        "location": "Properties > Object > Trace Options",
        "warning": "", # used for warning icon and text in add-ons panel
        "wiki_url": "https://github.com/paulbrzeski/manifold/wiki",
        "tracker_url": "https://github.com/paulbrzeski/manifold/issues",
        "support": "COMMUNITY",
    }

import bpy


#import pip
#pip.main(['install', 'svgtrace', '--user'])

import sys
packages_path = "C:\\Users\\Paul\\AppData\\Roaming\\Python\\Python39\\site-packages" # the path you see in console
sys.path.insert(0, packages_path )

import os


from pathlib import Path
from svgtrace import trace


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

class TraceOperator(bpy.types.Operator):
    bl_idname = 'manifold.trace'
    bl_label = 'Trace'
    bl_options = {'INTERNAL'}

    def execute(self, context):
        CURDIR = str(Path(__file__).resolve().parent.parent)
        print(CURDIR)

        filepath = bpy.data.images["demo2.jpg"].filepath_from_user()
        
        svg = trace(filepath)
        #print(svg)
        
        tmpfile = f"{CURDIR}\\demo2.svg"
        print(tmpfile)

        Path(tmpfile).write_text(svg, encoding="utf-8")
        bpy.ops.import_curve.svg(tmpfile)

        self.report({'INFO'}, "The custom operator actually worked!")
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
    # setup_demo()

def unregister():
    from bpy.utils import unregister_class
    for cls in reversed(classes):
        unregister_class(cls)

if __name__ == "__main__":
    register()
