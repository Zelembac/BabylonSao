var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  // scene.debugLayer.show();

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    BABYLON.Vector3(0.04, 0, 0)
  );
  camera.target = new BABYLON.Vector3(0.04, 0, 0);
  camera.attachControl(canvas, true);
  camera.wheelDeltaPercentage = 0.01;
  camera.position = new BABYLON.Vector3(0.19522278690950212, 0.32460103474098906, 2.34558162546303);
  scene.activeCamera.panningSensibility = 3000;
  camera.pinchPrecision = 100;
  camera.minZ = 0;

  const meshAlpha = new BABYLON.Animation(
    "meshAlpha",
    "visibility",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  let keyFramesMA = [];

  const cameraStartP = new BABYLON.Animation(
    "cameraStart",
    "position",
    60,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  let keyFramesP = [];

  const cameraPA = new BABYLON.Animation(
    "cameraStart",
    "position",
    60,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  let keyFramesPA = [];

  const cameraStartT = new BABYLON.Animation(
    "cameraStart",
    "target",
    60,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  let keyFramesT = [];

  scene.onBeforeRenderObservable.add(() => {
    keyFramesMA = [];

    keyFramesMA.push({
      frame: 0,
      value: 1,
    });
    keyFramesMA.push({
      frame: 60,
      value: 0,
    });
    meshAlpha.setKeys(keyFramesMA);
    camera.animations.push(meshAlpha);

    keyFramesT = [];

    keyFramesT.push({
      frame: 0,
      value: new BABYLON.Vector3(camera.target.x, camera.target.y, camera.target.z),
    });
    keyFramesT.push({
      frame: 60,
      value: new BABYLON.Vector3(0.04, 0, 0),
    });
    cameraStartT.setKeys(keyFramesT);
    camera.animations.push(cameraStartT);

    keyFramesP = [];

    keyFramesP.push({
      frame: 0,
      value: new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z),
    });
    keyFramesP.push({
      frame: 180,
      value: new BABYLON.Vector3(0.19522278690950212, 0.32460103474098906, 2.34558162546303),
    });
    cameraStartP.setKeys(keyFramesP);
    camera.animations.push(cameraStartP);

    keyFramesPA = [];

    keyFramesPA.push({
      frame: 0,
      value: new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z),
    });
    keyFramesPA.push({
      frame: 180,
      value: new BABYLON.Vector3(0.610909025600203, 0.5181633819530018, 3.7643090497065965),
    });
    cameraPA.setKeys(keyFramesPA);
    camera.animations.push(cameraPA);
  });

  // const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
  // light.intensity = 2.5;

  const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("environment.env", scene);

  scene.environmentIntensity = 1;

  scene.environmentTexture = hdrTexture;
  // var yellowMat = new BABYLON.StandardMaterial("yMat", scene);
  // yellowMat.diffuseColor = new BABYLON.Color3.FromHexString("#373a3c");
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  let opened = false;

  let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  document.getElementById("cameraBtn").addEventListener("click", function () {
    console.log(camera.position);
    if (opened) {
      scene.beginDirectAnimation(camera, [cameraPA, cameraStartT], 1, 60, false);
    } else {
      scene.beginDirectAnimation(camera, [cameraStartP, cameraStartT], 1, 60, false);
    }

    console.log(camera.position);
    // camera.target = new BABYLON.Vector3(0, 0, 0);
    // console.log(camera._currentTarget);
  });

  // var rect1 = new BABYLON.GUI.Rectangle();

  // rect1.width = 0.2;
  // rect1.height = 0.2;
  // rect1.cornerRadius = 20;
  // rect1.color = "#cfcfcf";
  // rect1.thickness = 4;
  // rect1.background = "#4f4f4e";
  // rect1.alpha = 0;
  // advancedTexture.addControl(rect1);

  // rect1.linkOffsetY = -250;
  // rect1.linkOffsetX = 350;

  // rect1.addControl(label);

  // var label = new BABYLON.GUI.TextBlock();
  // label.text = "Part bla bla bla";
  // rect1.addControl(label);

  let target = new BABYLON.GUI.Ellipse();
  target.width = "40px";
  target.height = "40px";
  target.color = "#cfcfcf";
  target.thickness = 4;
  target.background = "#4f4f4e";
  target.alpha = 0.5;

  advancedTexture.addControl(target);

  // var line = new BABYLON.GUI.Line();
  // line.lineWidth = 2;
  // line.color = "#cfcfcf";
  // line.y2 = 100;
  // line.linkOffsetY = -20;
  // line.alpha = 0;

  // advancedTexture.addControl(line);

  // line.connectedControl = rect1;
  let desBox = document.getElementById("desBox");
  desBox.style.left = "100vw";

  // desBox.style.display = "none";
  // let canvasZone = document.getElementById("renderCanvas");
  // canvasZone.style.width = "100%";

  target.onPointerClickObservable.add(() => {
    desBox.style.visibility = "visible";
    console.log(desBox.style.left);
    if (desBox.style.left == "100vw") {
      // desBox.style.display = "flex";
      desBox.style.left = "80vw";
      // canvasZone.style.width = "80%";
      // engine.resize();
    } else {
      // canvasZone.style.width = "100%";
      desBox.style.left = "100vw";
      // engine.resize();
      // desBox.style.display = "none";
    }
  });
  //   let br = 1;
  // target.onPointerClickObservable.add(() => {
  //   if (br == 1) {
  //     rect1.alpha = 0.5;
  //     line.alpha = 0.5;
  //     br = 0;
  //   } else {
  //     rect1.alpha = 0;
  //     line.alpha = 0;
  //     br = 1;
  //   }
  // });

  // rect1.linkOffsetY = -50;

  let animationGroup;
  let meshe;

  document.getElementById("openBtn").addEventListener("click", function () {
    // animationGroupA.stop();
    for (let i = 0; i < animationGroup.length; i++) {
      if (animationGroup[i].name.indexOf("Rotation") != -1) {
        animationGroup[i].stop();
      }
    }
    for (let i = 0; i < meshe.length; i++) {
      if (meshe[i].name.indexOf("Mesh_1_primitive") != -1) {
        if (meshe[i].visibility == 0) {
          scene.beginDirectAnimation(meshe[i], [meshAlpha], 60, 1, false);
        }
      }
    }

    if (opened) {
      // animationGroups[0].stop();
      if (animationGroupS.isStarted) {
        let masterFrame = animationGroupS.animatables[0].masterFrame;
        scene.beginDirectAnimation(camera, [cameraStartP], 1, 120, false);

        animationGroupS.stop();

        animationGroupS.start(false, 1, masterFrame, 1);
      } else {
        scene.beginDirectAnimation(camera, [cameraStartP], 1, 120, false);

        animationGroupS.stop();

        animationGroupS.start(false, 1, animationGroupS.to, 1);
      }

      // animationGroups[0].play();

      opened = false;
    } else {
      // animationGroups[0].play();

      if (animationGroupS.isStarted) {
        let masterFrame = animationGroupS.animatables[0].masterFrame;
        scene.beginDirectAnimation(camera, [cameraPA], 1, 120, false);

        animationGroupS.stop();

        animationGroupS.start(false, 1, masterFrame, animationGroupS.to);
      } else {
        scene.beginDirectAnimation(camera, [cameraPA], 1, 120, false);

        animationGroupS.stop();

        animationGroupS.start(false, 1, 1, animationGroupS.to);
      }
      opened = true;
    }
    // if (
    //   pointerInfo.pickInfo.pickedMesh.id == "Object_210" ||
    //   pointerInfo.pickInfo.pickedMesh.id == "Object_207" ||
    //   pointerInfo.pickInfo.pickedMesh.id == "Object_204"
    // ) {
    //   horn.play();
    // }
  });

  document.getElementById("playBtn").addEventListener("click", function () {
    if (!opened) {
      for (let i = 0; i < meshe.length; i++) {
        if (meshe[i].name.indexOf("Mesh_1_primitive") != -1) {
          if (meshe[i].visibility != 0) {
            scene.beginDirectAnimation(meshe[i], [meshAlpha], 1, 60, false);
          } else {
            scene.beginDirectAnimation(meshe[i], [meshAlpha], 60, 1, false);
          }
        }
      }

      for (let i = 0; i < animationGroup.length; i++) {
        if (animationGroup[i].name.indexOf("Rotation") != -1) {
          if (animationGroup[i].isStarted) {
            animationGroup[i].stop();
          } else {
            animationGroup[i].start(true, 1, 1, animationGroup[i].to);
          }
        }
      }
    }
  });

  let animationGroupS = new BABYLON.AnimationGroup("GroupS");
  let animationGroupA = new BABYLON.AnimationGroup("GroupA");

  BABYLON.SceneLoader.ImportMesh(
    "",
    "",
    "TaycanGearRotation2.glb",
    scene,
    (meshes, particleSystem, skeleton, animationGroups) => {
      meshes[0].scaling = new BABYLON.Vector3(5, 5, 5);

      animationGroup = animationGroups;

      console.log(meshes);
      meshe = meshes;
      // for (let i = 0; i < meshes.length; i++) {
      //   if (meshes[i].name.indexOf("Mesh_1_primitive") != -1) {
      //     meshes[i].material.alpha = 0;
      //   }
      // }

      // let { min, max } = meshes[0].getHierarchyBoundingVectors();

      // meshes[0].setBoundingInfo(new BABYLON.BoundingInfo(min, max));

      // meshes[0].showBoundingBox = true;
      for (let i = 0; i < animationGroups.length; i++) {
        if (animationGroups[i].name.indexOf("Rotation") != -1) {
          // animationGroups[i].start(true, 1, 1, animationGroups[i].to);
          // animationGroupA.addTargetedAnimation(
          //   animationGroups[i].targetedAnimations[0].animation,
          //   animationGroups[i].targetedAnimations[0].target
          // );
          // animationGroupA.normalize(0, 120);
          // animationGroupA.start(true, 1, 1, animationGroupA.to);
        } else {
          animationGroupS.addTargetedAnimation(
            animationGroups[i].targetedAnimations[0].animation,
            animationGroups[i].targetedAnimations[0].target
          );
        }
      }
      // animationGroupA.normalize(0, 120);
      animationGroupS.normalize(0, 180);

      console.log(animationGroupA);

      target.linkWithMesh(meshes[1]);
      // animationGroupA.stop();
      // animationGroupS.stop();
      animationGroups[0].stop();

      // line.linkWithMesh(meshes[1]);

      // animationGroup = animationGroups[0];

      // rect1.linkWithMesh(meshes[1]);

      // line.linkWithMesh(sphere);
      // rect1.linkWithMesh(sphere);

      // for (let i = 0; i < meshes.length; i++) {
      //   meshes[i].material = yellowMat;
      // }
      scene.onPointerObservable.add((pointerInfo) => {
        // for (let i = 0; i < meshes.length; i++) {
        //   if (meshes[i].name.indexOf("Mesh_1_primitive") != -1) {
        //     console.log(meshes[i].material.alpha);
        //     if (meshes[i].material.alpha > 0) {
        //       meshes[i].material.alpha = meshes[i].material.alpha - 0.01;
        //     }
        //   }
        // }
        // if (!animationGroups[1].isStarted && !opened && !animationGroupS.isStarted) {
        //   for (let i = 0; i < animationGroups.length; i++) {
        //     if (animationGroups[i].name.indexOf("Rotation") != -1) {
        //       animationGroups[i].start(true, 1, 1, animationGroups[i].to);
        //     }
        //   }
        // }
        // if (!animationGroupA.isStarted && !opened && !animationGroupS.isStarted) {
        //   // for (let i = 0; i < animationGroups.length; i++) {
        //   //   if (animationGroups[i].name.indexOf("Rotation") != -1) {
        //   console.log("kuj djavo");
        //   animationGroupA.start(true, 1, 1, animationGroupA.to);
        //   //   }
        //   // }
        // }
        // Only trigger on pointer move
        // if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        //   // Check if animation is not playing at all
        //   if (!animationGroupA.isPlaying && !opened && !animationGroupS.isStarted) {
        //     console.log("Starting looped rotation animation");
        //     // Set loop to true and speedRatio to control animation speed if needed
        //     animationGroupA.start(true, 1, 0, animationGroupA.to);
        //   }
        // }
        // if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
        // document.getElementById("playBtn").addEventListener("click", function () {
        //   console.log("ovde");
        //   if (opened) {
        //     console.log("11");
        //     console.log(opened);
        //     // animationGroups[0].stop();
        //     if (animationGroups[0].isStarted) {
        //       let masterFrame = animationGroups[0].animatables[0].masterFrame;
        //       animationGroups[0].stop();
        //       scene.beginDirectAnimation(camera, [cameraStartP, cameraStartT], 0, 60, false);
        //       animationGroups[0].start(false, 1, masterFrame, 1);
        //     } else {
        //       animationGroups[0].stop();
        //       scene.beginDirectAnimation(camera, [cameraStartP, cameraStartT], 0, 60, false);
        //       animationGroups[0].start(false, 1, animationGroups[0].to, 1);
        //     }
        //     // animationGroups[0].play();
        //     opened = false;
        //   } else {
        //     console.log("21");
        //     console.log(opened);
        //     // animationGroups[0].play();
        //     if (animationGroups[0].isStarted) {
        //       let masterFrame = animationGroups[0].animatables[0].masterFrame;
        //       animationGroups[0].stop();
        //       scene.beginDirectAnimation(camera, [cameraPA], 0, 60, false);
        //       animationGroups[0].start(false, 1, masterFrame, animationGroups[0].to);
        //     } else {
        //       animationGroups[0].stop();
        //       scene.beginDirectAnimation(camera, [cameraPA], 0, 60, false);
        //       animationGroups[0].start(false, 1, 1, animationGroups[0].to);
        //     }
        //     opened = true;
        //   }
        //   // if (
        //   //   pointerInfo.pickInfo.pickedMesh.id == "Object_210" ||
        //   //   pointerInfo.pickInfo.pickedMesh.id == "Object_207" ||
        //   //   pointerInfo.pickInfo.pickedMesh.id == "Object_204"
        //   // ) {
        //   //   horn.play();
        //   // }
        // });
        // }
      });
    }
  );
  let ssaoRatio = {
    ssaoRatio: 0.5,
    blurRatio: 1,
  }; // Ratio of the SSAO post-process, in a lower resolution

  let ssao = new BABYLON.SSAO2RenderingPipeline("ssao2", scene, ssaoRatio, [camera]);
  ssao.totalStrength = 1.6;
  ssao.base = 0;
  ssao.radius = 1;
  ssao.epsilon = 0.01;
  ssao.samples = 25;
  console.log(ssao);
  scene.prePassRenderer.samples = 25;

  let defaultRendering = new BABYLON.DefaultRenderingPipeline("defRend", true, scene);

  defaultRendering.fxaaEnabled = true;
  defaultRendering.samples = 8;

  console.log(defaultRendering);

  // // Attach camera to the SSAO render pipeline
  // scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);

  return scene;
};
window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
