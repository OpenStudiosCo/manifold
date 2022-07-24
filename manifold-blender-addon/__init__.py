bl_info={
    "name":"2D to 3D Manifold",
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

from . import ui

# To support reload properly, try to access a package var,
# if it's there, reload everything
if "bpy" in locals():
    import importlib
    if "ui" in locals():
        importlib.reload(ui)

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

def register():
    ui.register()

def unregister():
    ui.unregister()

if __name__ == '__main__':
    register()