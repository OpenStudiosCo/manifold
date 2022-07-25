import bpy
import importlib
import pip
def installPackage(package):
    if hasattr(pip, 'main'):
        pip.main(['install', '--user', package])
    else:
        pip._internal.main(['install', '--user', package])

# Running installPackage is a slow operation, therefore we want to make sure that we only run it when necessary
def attemptToImportModuleAndInstallItIfItIfTheCorespondingPackageDoesntExist(packageName, moduleName): 
    print("Attempting")
    try:
        importlib.import_module(moduleName)
        # from PIL import Image
    except Exception as error:
        print(f"Error: ---\n{error}\n---\nwhen attempting to import {moduleName}, we're assuming that you dont have {packageName} installed and will try to install it for you!")
        installPackage(packageName)
        importlib.import_module(moduleName) # Doesnt actually work? 

attemptToImportModuleAndInstallItIfItIfTheCorespondingPackageDoesntExist('svgtrace', 'svgtrace')

import site
packages_path = site.getusersitepackages()[0]
sys.path.insert(0, packages_path )

from pathlib import Path
from svgtrace import trace

class TraceOperator(bpy.types.Operator):
    bl_idname = 'manifold.trace'
    bl_label = 'Trace'
    bl_options = {'INTERNAL'}

    def execute(self, context):
        CURDIR = str(Path(__file__).resolve().parent.parent)
        print(CURDIR)

        filepath = bpy.context.active_object.active_material.node_tree.nodes["Image Texture"].image.filepath_from_user()        
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
