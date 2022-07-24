import bpy

#import pip
#pip.main(['install', 'svgtrace', '--user'])
import sys
packages_path = "C:\\Users\\Paul\\AppData\\Roaming\\Python\\Python39\\site-packages" # the path you see in console
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

        self.report({'INFO'}, "The custom operator actually worked!!!123")
        return {'FINISHED'}
