AFRAME.registerPrimitive( 'a-disc', {

    defaultComponents: {

        disc: {},

    },

    mappings: {

        'thickness': 'disc.thickness',
        'inner-radius': 'disc.innerRadius',
        'outer-radius': 'disc.outerRadius',
        'segments': 'disc.segments',
        'color': 'disc.color'

    }

} );

AFRAME.registerComponent( 'disc', {

    schema: {

        thickness: { default: 1.0 },
        innerRadius: { default: 0.5 },
        outerRadius: { default: 1.0 },
        segments: { default: 60 },
        color: { default: '#FFF', type: 'color' }

    },

    init: function() {

        let el = this.el;
        let data = this.data;
        let thickness = data.thickness;
        let innerRadius = data.innerRadius;
        let outerRadius = data.outerRadius;
        let segments = data.segments;
        let color = data.color;
        let mesh = this.mesh;
        let material = el.components.material;

        if ( ! material ) {

            material = {};
            material.material = new THREE.MeshPhongMaterial( { color } );

        }

        let shape = new THREE.Shape();
        shape.moveTo( outerRadius * 2, outerRadius );
        shape.absarc( outerRadius, outerRadius, outerRadius, 0, Math.PI * 2, false );

        let hole = new THREE.Path();
        hole.moveTo( outerRadius + innerRadius, outerRadius );
        hole.absarc( outerRadius, outerRadius, innerRadius, 0, Math.PI * 2, true );

        shape.holes.push( hole );

        let geometry = new THREE.ExtrudeGeometry( shape, {

            depth: thickness,
            bevelEnabled: false,
            steps: 1,
            curveSegments: segments

        } );

        geometry.center();

        mesh = new THREE.Mesh( geometry, material.material );
        mesh.rotation.set( - Math.PI / 2, 0, 0 );
        this.el.setObject3D( 'mesh', mesh );

    },

    update: function (oldData) {

        if ( ! Object.keys( oldData ).length ) return;

        this.remove();
        this.init();

    },

    remove: function () {

        if ( this.mesh ) this.el.removeObject3D( 'mesh' );

    }

} );
