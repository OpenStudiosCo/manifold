# Import Blender base
import bpy

# Import user site packages
import site
import sys
packages_path = site.getusersitepackages()
sys.path.insert(0, packages_path )

# Path helpers
from pathlib import Path
from pathlib import PurePath

# Import svgtrace, install if needed.
try:
    from svgtrace import trace
    import potrace
except ImportError as e:
    import pip
    pip.main(['install', 'svgtrace', '--user'])
    pip.main(['install', 'potracer', '--user'])
    from svgtrace import trace
    import potrace

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
        
        tmpfile = str(PurePath(CURDIR, "Manifold Preview"))
        print(tmpfile)

        Path(tmpfile).write_text(svg, encoding="utf-8")
        bpy.ops.import_curve.svg(filepath=tmpfile)
        scale = 10.
        for obj in bpy.data.collections['Manifold Preview'].all_objects:
            obj.scale = ( scale, scale, scale)
            obj.rotation_euler[0] = 1.5708
            obj.rotation_euler[2] = 1.5708
            obj.location[1] = -0.8
            obj.location[2] = 0.5

        self.report({'INFO'}, "The custom operator actually worked!!!")
        return {'FINISHED'}
