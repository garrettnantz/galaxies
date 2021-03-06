"use strict";
/**
 * Resources
 *
 * Stores hashes of materials, models, and related constructs.
 * May not be instantiated before galaxies.queue is populated.
 * 
 */


this.galaxies = this.galaxies || {};


galaxies.Resources = function() {

    // Skybox
    this.skyTexture = new THREE.CubeTexture([
        galaxies.queue.getResult("skyboxright1"),
        galaxies.queue.getResult("skyboxleft2"),
        galaxies.queue.getResult("skyboxtop3"),
        galaxies.queue.getResult("skyboxbottom4"),
        galaxies.queue.getResult("skyboxfront5"),
        galaxies.queue.getResult("skyboxback6")
    ]);
    this.skyTexture.generateMipMaps = false;
    this.skyTexture.magFilter = THREE.LinearFilter,
        this.skyTexture.minFilter = THREE.LinearFilter;
    this.skyTexture.needsUpdate = true;

    this.skyRefract = new THREE.CubeTexture([
        galaxies.queue.getResult("skyboxright1"),
        galaxies.queue.getResult("skyboxleft2"),
        galaxies.queue.getResult("skyboxtop3"),
        galaxies.queue.getResult("skyboxbottom4"),
        galaxies.queue.getResult("skyboxfront5"),
        galaxies.queue.getResult("skyboxback6")
    ]);
    this.skyRefract.generateMipMaps = false;
    this.skyRefract.magFilter = THREE.LinearFilter,
        this.skyRefract.minFilter = THREE.LinearFilter;
    this.skyRefract.mapping = THREE.CubeRefractionMapping;
    this.skyRefract.needsUpdate = true;

    // Background Planets
    this.planetData = [];
    this.planetData[0] = {
        name: "Pluto",
        texture: new THREE.Texture(galaxies.queue.getResult("planetpluto")),
        scale: 0.55,
        moonColor: "#c08d9c"
    };
    this.planetData[1] = {
        name: "Neptune",
        texture: new THREE.Texture(galaxies.queue.getResult("planetneptune")),
        scale: 1,
        moonColor: "#f5d2c7"
    };
    this.planetData[2] = {
        name: "Uranus",
        texture: new THREE.Texture(galaxies.queue.getResult("planeturanus")),
        scale: 1,
        moonColor: "#7ad8ff",
        position: new THREE.Vector3(40, 90, -80)
    };
    this.planetData[3] = {
        name: "Saturn",
        texture: new THREE.Texture(galaxies.queue.getResult("planetsaturn")),
        scale: 1.75,
        moonColor: "#87c5af"
    };
    this.planetData[4] = {
        name: "Jupiter",
        texture: new THREE.Texture(galaxies.queue.getResult("planetjupiter")),
        scale: 1,
        moonColor: "#e3d781"
    };
    this.planetData[5] = {
        name: "Mars",
        texture: new THREE.Texture(galaxies.queue.getResult("planetmars")),
        scale: 1,
        moonColor: "#f2bbaf",
        position: new THREE.Vector3(40, 90, -80)
    };
    this.planetData[6] = {
        name: "Earth",
        texture: new THREE.Texture(galaxies.queue.getResult("planetearth")),
        scale: 1,
        moonColor: "#f5eae6"
    };

    this.levelTitles = [];
    this.levelTitles[0] = "Defend<br>The Plutonian Perimeter";
    this.levelTitles[1] = "Protect<br>The Neptunian Neutral Zone";
    this.levelTitles[2] = "Guard<br>The Uranian Outer Realm";
    this.levelTitles[3] = "Preserve<br>The Saturnian Sector";
    this.levelTitles[4] = "Safeguard<br>The Jovian Galactic Region";
    this.levelTitles[5] = "Secure<br>The Martian Microcosm";
    this.levelTitles[6] = "Save<br>The Terrestrial Territories";
    for (var i = 0, len = this.levelTitles.length; i < len; i++) {
        this.levelTitles[i] = this.levelTitles[i].toUpperCase();
    }


    for (var i = 0, len = this.planetData.length; i < len; i++) {
        this.planetData[i].texture.needsUpdate = true;
    }

    // Light angles by level
    this.lightAngles = [
        [0, 20],
        [135, 20],
        [-90, 20],
        [45, 20],
        [30, 30],
        [170, -20],
        [0, 25]
    ];

    this.geometries = {};
    this.materials = {};

    // Parse and cache loaded geometry.
    var objLoader = new THREE.OBJLoader();
    var parsed = objLoader.parse(galaxies.queue.getResult("asteroidmodel"));
    this.geometries["asteroid"] = parsed.children[0].geometry;
    parsed = objLoader.parse(galaxies.queue.getResult("icyasteroidmodel"));
    this.geometries["asteroidice"] = parsed.children[0].geometry;
    parsed = objLoader.parse(galaxies.queue.getResult("glowasteroidmodel"));
    this.geometries["asteroidrad"] = parsed.children[0].geometry;
    this.geometries["asteroidrad"].merge(parsed.children[1].geometry);
    var spikymodel = objLoader.parse(galaxies.queue.getResult("spikyasteroidmodel"));
    this.geometries["spiky"] = spikymodel.children[0].geometry;
    var projmodel = objLoader.parse(galaxies.queue.getResult("projmodel"));
    this.geometries["proj"] = projmodel.children[0].geometry;
    var satmodel = objLoader.parse(galaxies.queue.getResult("satellitemodel"));
    this.geometries["satellite"] = satmodel.children[0].geometry;
    var moonmodel = objLoader.parse(galaxies.queue.getResult("moonmodel"));
    this.geometries["moon"] = moonmodel.children[0].geometry;
    var ufomodel = objLoader.parse(galaxies.queue.getResult("ufomodel"));
    this.geometries["ufo"] = ufomodel;
    var debrismodel = objLoader.parse(galaxies.queue.getResult("satellitedebrismodel"));
    this.geometries["debris"] = debrismodel.children[0].geometry;


    // define materials
    var asteroidColor = new THREE.Texture(galaxies.queue.getResult("asteroidcolor"), THREE.UVMapping);
    asteroidColor.needsUpdate = true;
    var asteroidNormal = new THREE.Texture(galaxies.queue.getResult("asteroidnormal"), THREE.UVMapping);
    asteroidNormal.needsUpdate = true;

    this.materials["asteroid"] = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x000000,
        transparent: false,
        map: asteroidColor,
        normalMap: asteroidNormal,
        shading: THREE.SmoothShading
    });

    var icyAsteroidColor = new THREE.Texture(galaxies.queue.getResult("icyasteroidcolor"), THREE.UVMapping);

    icyAsteroidColor.needsUpdate = true;

    this.materials["asteroidice"] = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x11111f,
        specular: 0xddddff,
        shininess: 10,
        map: icyAsteroidColor,
        normalMap: asteroidNormal,
        shading: THREE.SmoothShading
    });

    this.materials["rubbleice"] = new THREE.MeshLambertMaterial({
        color: 0x74858c
    });

    this.materials["asteroidiceshell"] = new THREE.MeshPhongMaterial({
        color: 0x242a2a,
        emissive: 0x11111f,
        specular: 0xddddff,
        shininess: 10,
        opacity: 0.9,
        transparent: true,
        map: icyAsteroidColor,
        normalMap: asteroidNormal,
        shading: THREE.SmoothShading,
        blending: THREE.AdditiveBlending

    });

    var glowAsteroidColor = new THREE.Texture(galaxies.queue.getResult("glowasteroidcolor"), THREE.UVMapping),
        glowAsteroidAmbient = new THREE.Texture(galaxies.queue.getResult("glowasteroidambient"), THREE.UVMapping);

    glowAsteroidColor.needsUpdate = true;
    glowAsteroidAmbient.needsUpdate = true;

    this.materials["asteroidrad"] = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x555555,
        specular: 0xccffcc,
        map: glowAsteroidColor,
        normalMap: asteroidNormal,
        emissiveMap: glowAsteroidAmbient,
        shading: THREE.SmoothShading
    });

    var spikyColor = new THREE.Texture(galaxies.queue.getResult("spikycolor"), THREE.UVMapping);
    var spikyNormal = new THREE.Texture(galaxies.queue.getResult("spikynormal"), THREE.UVMapping);
    var spikySpecular = new THREE.Texture(galaxies.queue.getResult("spikyspecular"), THREE.UVMapping);
    var spikyEmissive = new THREE.Texture(galaxies.queue.getResult("spikyemissive"), THREE.UVMapping);

    spikyColor.needsUpdate = true;
    spikyNormal.needsUpdate = true;
    spikySpecular.needsUpdate = true;
    spikyEmissive.needsUpdate = true;

    this.materials["spiky"] = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        map: spikyColor,
        specular: 0xFFFFFF,
        specularMap: spikySpecular,
        normalMap: spikyNormal,
        emissive: 0x000000,
        emissiveMap: spikyEmissive,
        shading: THREE.SmoothShading
    });


    var satColor = new THREE.Texture(galaxies.queue.getResult("satellitecolor"), THREE.UVMapping);
    satColor.needsUpdate = true;

    this.materials["satellite"] = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x202020,
        shininess: 50,
        transparent: false,
        map: satColor,
        shading: THREE.SmoothShading
    });


    var moonOcclusion = new THREE.Texture(galaxies.queue.getResult("moonocclusion"), THREE.UVMapping);
    moonOcclusion.needsUpdate = true;
    var moonNormal = new THREE.Texture(galaxies.queue.getResult("moonnormal"), THREE.UVMapping);
    moonNormal.needsUpdate = true;

    this.materials["moon"] = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0x000000,
        map: moonOcclusion,
        normalMap: moonNormal,
        shading: THREE.SmoothShading
    });


    this.materials["shield"] = new THREE.ShaderMaterial({
        uniforms: galaxies.shaders.materials.shield.getUniforms(),
        vertexShader: galaxies.shaders.materials.shield.vertexShader,
        fragmentShader: galaxies.shaders.materials.shield.fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false
    });


    var ufoColor = new THREE.Texture(galaxies.queue.getResult("ufocolor"));
    ufoColor.needsUpdate = true;
    this.materials["ufo"] = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x661313,
        shininess: 90,
        transparent: false,
        map: ufoColor,
        shading: THREE.SmoothShading,
        depthTest: true
    });
    this.materials["ufocanopy"] = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0x222222,
        shininess: 100,
        opacity: 0.9,
        transparent: true,
        shading: THREE.SmoothShading,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    var projColor = new THREE.Texture(galaxies.queue.getResult("projcolor"), THREE.UVMapping);
    projColor.needsUpdate = true;

    this.materials["proj"] = new THREE.MeshBasicMaterial({
        color: 0xcccccc,

        map: projColor,
        shading: THREE.SmoothShading
    });

    this.materials["debris"] = new THREE.MeshPhongMaterial({
        color: 0x999999,
        specular: 0x202020,
        shininess: 50,
        transparent: true,
        shading: THREE.SmoothShading
    });


};