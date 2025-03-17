class RubikDOM {
  static scene = $( ".scene" )

  static faceClasses = [
      "front", // 0
      "right", // 1
      "back",  // 2
      "left",  // 3
      "up"   , // 4
      "down",  // 5
    ]

  constructor( size ){
    this.size = size
    this.animation = {
      /** @type { number } */
      start: 0,
      /** @type { number } ms */
      time: 0,
      /** @type { number | null } */
      depth: null,
      playing: false
    }

    // RubikDOM.scene.css( "--tiles-length", size )
    document.documentElement.style.setProperty( 
      "--tiles-length", 
      size.toString() 
    )

    this.cube = new RubikCube( size )

    this.tiles = {
      front: this.#createFace( 0,  0,   0 ),
      right: this.#createFace( 0,  90,  0 ),
      back:  this.#createFace( 0,  180, 0 ),
      left:  this.#createFace( 0,  270, 0 ),
      up:    this.#createFace( 90, 0,   0 ),
      down:  this.#createFace( 90, 180, 180 )
    }

    this.updateAllTilesClasses()

    this.rotateFrontClockwise = this.rotateFrontClockwise.bind( this )
  }

  setAnimationTime( time ) {
    if( time < 0 ) time = 0
    this.animation.time = time
  }

  /**
   * 
   * @param { Array2D< number > } face 
   */
  updateAllTilesClasses() {
    this.#updateFrontFace()
    this.#updateRightFace()
    this.#updateBackFace()
    this.#updateLeftFace()
    this.#updateUpFace()
    this.#updateDownFace()
  }

  // #region Rubik Tile Class Updates

  #updateFrontFace() {
    this.#updateFace(
      this.cube.getFrontFaceValues(),
      this.tiles.front
    )
  }

  #updateRightFace() {
    this.#updateFace(
      this.cube.getRightFaceValues(),
      this.tiles.right
    )
  }

  #updateBackFace() {
    this.#updateFace(
      this.cube.getBackFaceValues(),
      this.tiles.back
    )
  }

  #updateLeftFace() {
    this.#updateFace(
      this.cube.getLeftFaceValues(),
      this.tiles.left
    )
  }

  #updateUpFace() {
    this.#updateFace(
      this.cube.getUpFaceValues(),
      this.tiles.up
    )
  }

  #updateDownFace() {
    this.#updateFace(
      this.cube.getDownFaceValues(),
      this.tiles.down
    )
  }
  // #endregion

  /**
   * Sets classes for each tile of a face to appropriate color.
   * 
   * @param { Array2D< number > } values 
   * @param { Array2D< Tile3D > } face 
   */
  #updateFace( values, face ){
    for( let row = 0; row < this.size; row++ ){
      for( let column = 0; column < this.size; column++ ){
        const value = values.get( row, column )
        const tile = face.get( row, column )

        this.#removeTileColor( tile )

        tile.addClass( RubikDOM.faceClasses[ value ] )
      }
    }
  }

  /**
   * Removes all color classes from a tile.
   * 
   * @param { Tile3D } tile 
   */
  #removeTileColor( tile ) {
    for( const cssClass of RubikDOM.faceClasses ){
      tile.removeClass( cssClass )
    }
  }

  /* #endregion */

  /**
   * Creates a grid of tiles on a specified face with given
   * rotation and list of classes.
   * 
   * @param { number } rx 
   * @param { number } ry 
   * @param { number } rz 
   * @returns { Array2D< Tile3D > }
   */
  #createFace( rx, ry, rz ) {
    const array = new Array2D( this.size, this.size )
    const classes = [ "tile", "tile3d" ]

    for( let y = 0; y < this.size; y++ ){
      for( let x = 0; x < this.size; x++ ){
        const tile = new Tile3D( 
          x, y, 
          rx, ry, rz, 
          classes
        ) 

        array.set( y, x, tile )
      }
    }

    return array
  }

  remove() {
    for( const tiles of Object.values( this.tiles ) ){
      for( const tile of tiles.values() ) {
        tile.remove()
      }
    }
  }

  /**
   * 
   * @param { Array2D< Tile3D > } tiles 
   * @param { number } arx 
   * @param { number } ary 
   * @param { number } arz 
   */
  #bulkSetRotations( tiles, arx, ary, arz ){
    for( const tile of tiles.values() ) {
      tile.setRelativeRotations( arx, ary, arz )
    }
  }

  resetAllRotations() {
    for( const face of Object.values( this.tiles ) ){
      for( const tile of face.values() ) {
        tile.setRelativeRotations( 0, 0, 0 )
      }
    }
  }

  // me, 2024-10-04 20:20: this is prolly gonna take a lot of lines

  // #region Rubik Rotation Animations.

  #animateFrontClockwise( time, depth ){
    // debugger
    this.#checkTimeErrors( time )
    this.#checkDepthErrors( depth )

    this.resetAllRotations()

    const lastIndex = this.#getLastIndex()

    if( depth === 0 ){
      this.#bulkSetRotations(
        this.tiles.front,
        0, 0, time * 90
      )
    }

    if( depth === lastIndex ){
      this.#bulkSetRotations(
        this.tiles.back,
        0, 0, time * 90
      )
    }

    this.#bulkSetRotations(
      this.tiles.right.getColumn( depth ),
      0, 0, time * 90
    )

    this.#bulkSetRotations(
      this.tiles.left.getColumn( lastIndex - depth ),
      0, 0, time * 90
    )

    this.#bulkSetRotations(
      this.tiles.up.getRow( lastIndex - depth ),
      0, time * 90, 0
    )

    this.#bulkSetRotations(
      this.tiles.down.getRow( depth ),
      0, time * -90, 0
    )
  }

  #animateRightClockwise( time, depth ){
    this.#checkTimeErrors( time )
    this.#checkDepthErrors( depth )

    this.resetAllRotations()

    const lastIndex = this.#getLastIndex()

    if( depth === 0 ){
      this.#bulkSetRotations(
        this.tiles.right,
        time * 90, 0, 0
      )
    }

    if( depth === lastIndex ){
      this.#bulkSetRotations(
        this.tiles.left,
        time * 90, 0, 0
      )
    }

    this.#bulkSetRotations(
      this.tiles.front.getColumn( lastIndex - depth ),
      time * 90, 0, 0
    )

    this.#bulkSetRotations(
      this.tiles.up.getColumn( lastIndex - depth ),
      time * 90, 0, 0
    )

    this.#bulkSetRotations(
      this.tiles.down.getColumn( lastIndex - depth ),
      time * 90, 0, 0
    )

    this.#bulkSetRotations(
      this.tiles.back.getColumn( depth ),
      time * 90, 0, 0
    )
  }

  #animateBackClockwise( time, depth ){
    this.#checkTimeErrors( time )
    this.#checkDepthErrors( depth )

    this.resetAllRotations()

    const lastIndex = this.#getLastIndex()

    if( depth === 0 ){
      this.#bulkSetRotations(
        this.tiles.back,
        0, 0, time * -90
      )
    }

    if( depth === lastIndex ){
      this.#bulkSetRotations(
        this.tiles.front,
        0, 0, time * -90
      )
    }

    this.#bulkSetRotations(
      this.tiles.right.getColumn( lastIndex - depth ),
      0, 0, time * -90
    )

    this.#bulkSetRotations(
      this.tiles.left.getColumn( depth ),
      0, 0, time * -90
    )

    this.#bulkSetRotations(
      this.tiles.up.getRow( depth ),
      0, time * -90, 0
    )

    this.#bulkSetRotations(
      this.tiles.down.getRow( lastIndex - depth ),
      0, time * 90, 0
    )
  }

  #animateLeftClockwise( time, depth ){
    this.#checkTimeErrors( time )
    this.#checkDepthErrors( depth )

    this.resetAllRotations()

    const lastIndex = this.#getLastIndex()

    if( depth === 0 ){
      this.#bulkSetRotations(
        this.tiles.left,
        time * -90, 0, 0
      )
    }

    if( depth === lastIndex ){
      this.#bulkSetRotations(
        this.tiles.right,
        time * -90, 0, 0
      )
    }

    this.#bulkSetRotations(
      this.tiles.front.getColumn( depth ),
      time * -90, 0, 0
    )

    this.#bulkSetRotations(
      this.tiles.up.getColumn( depth ),
      time * -90, 0, 0
    )

    this.#bulkSetRotations(
      this.tiles.down.getColumn( depth ),
      time * -90, 0, 0
    )

    this.#bulkSetRotations(
      this.tiles.back.getColumn( lastIndex - depth ),
      time * -90, 0, 0
    )
  }

  #animateUpClockwise( time, depth ) {
    this.#checkTimeErrors( time )
    this.#checkDepthErrors( depth )

    this.resetAllRotations()

    const lastIndex = this.#getLastIndex()

    if( depth === 0 ){
      this.#bulkSetRotations(
        this.tiles.up,
        0, 0, time * 90
      )
    }

    if( depth === lastIndex ){
      this.#bulkSetRotations(
        this.tiles.down,
        0, 0, time * 90
      )
    }

    this.#bulkSetRotations(
      this.tiles.front.getRow( depth ),
      0, time * -90, 0
    )

    this.#bulkSetRotations(
      this.tiles.right.getRow( depth ),
      0, time * -90, 0
    )

    this.#bulkSetRotations(
      this.tiles.back.getRow( depth ),
      0, time * -90, 0
    )

    this.#bulkSetRotations(
      this.tiles.left.getRow( depth ),
      0, time * -90, 0
    )
  }

  #animateDownClockwise( time, depth ) {
    this.#checkTimeErrors( time )
    this.#checkDepthErrors( depth )

    this.resetAllRotations()

    const lastIndex = this.#getLastIndex()

    if( depth === 0 ){
      this.#bulkSetRotations(
        this.tiles.down,
        0, 0, time * -90
      )
    }

    if( depth === lastIndex ){
      this.#bulkSetRotations(
        this.tiles.up,
        0, 0, time * -90
      )
    }

    this.#bulkSetRotations(
      this.tiles.front.getRow( lastIndex - depth ),
      0, time * 90, 0
    )

    this.#bulkSetRotations(
      this.tiles.right.getRow( lastIndex - depth ),
      0, time * 90, 0
    )

    this.#bulkSetRotations(
      this.tiles.back.getRow( lastIndex - depth ),
      0, time * 90, 0
    )

    this.#bulkSetRotations(
      this.tiles.left.getRow( lastIndex - depth ),
      0, time * 90, 0
    )
  }

  #animateFrontCounterclockwise( time, depth ) {
    this.#animateBackClockwise( time, this.#getLastIndex() - depth )
  }

  #animateRightCounterclockwise( time, depth ) {
    this.#animateLeftClockwise( time, this.#getLastIndex() - depth )
  }

  #animateBackCounterclockwise( time, depth ) {
    this.#animateFrontClockwise( time, this.#getLastIndex() - depth )
  }

  #animateLeftCounterclockwise( time, depth ) {
    this.#animateRightClockwise( time, this.#getLastIndex() - depth )
  }

  #animateUpCounterclockwise( time, depth ) {
    this.#animateDownClockwise( time, this.#getLastIndex() - depth )
  }

  #animateDownCounterclockwise( time, depth ) {
    this.#animateUpClockwise( time, this.#getLastIndex() - depth )
  }




  // #endregion

  // me, 2024-10-04 21:14: not bad, expected worse

  #checkTimeErrors( time ){
    if( typeof time !== "number" ) throw new Error(
      "Given time is not a number." +
      ` ( got: ${ time } )`
    )

    if( time < 0 || time > 1 ) throw new Error( 
      "Time value is out of bounds " +
      ` ( 0 <= ${ time } <= 1 is false )` 
    )
  }

  #checkDepthErrors( depth ){
    if( typeof depth != "number" ) throw new Error(
      "Given depth is not a number." +
      ` ( got: ${ depth } )`
    )

    if( depth < 0 ) throw new Error( 
      "Given rotation depth is out of bounds." + 
      ` ( got: ${ depth } )` 
    )

    if( depth >= this.size ) throw new Error( 
      "Given rotation depth is out of bounds." + 
      ` ( got: ${ depth }, size: ${ this.size } )` 
    )
  }

  #getLastIndex() {
    return this.size - 1
  }

  abortAnimation() {
    this.animation.start = 0
  }

  /**
   * @param { () => any } animFunction 
   * @param { number } depth 
   */
  #startAnimation( animFunction, depth ){
    this.animation.start = Date.now()
    this.animation.depth = depth

    this.animation.playing = true;

    if( this.animation.time < 0 ){
      this.updateAllTilesClasses()
    } else {
      requestAnimationFrame( animFunction.bind( this ) )
    }
  }

  // #region True cube rotations.

  // #region Clockwise

  rotateFrontClockwise( depth ) {
    this.cube.rotateFrontClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateFrontClockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateRightClockwise( depth ) {
    this.cube.rotateRightClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateRightClockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateBackClockwise( depth ) {
    this.cube.rotateBackClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateBackClockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateLeftClockwise( depth ) {
    this.cube.rotateLeftClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateLeftClockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateUpClockwise( depth ) {
    this.cube.rotateUpClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateUpClockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateDownClockwise( depth ) {
    this.cube.rotateDownClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateDownClockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  // #endregion 

  // #region Counterclockwise

  rotateFrontCounterclockwise( depth ) {
    this.cube.rotateFrontClockwise( depth )
    this.cube.rotateFrontClockwise( depth )
    this.cube.rotateFrontClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateFrontCounterclockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateRightCounterclockwise( depth ) {
    this.cube.rotateRightClockwise( depth )
    this.cube.rotateRightClockwise( depth )
    this.cube.rotateRightClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateRightCounterclockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateBackCounterclockwise( depth ) {
    this.cube.rotateBackClockwise( depth )
    this.cube.rotateBackClockwise( depth )
    this.cube.rotateBackClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateBackCounterclockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateLeftCounterclockwise( depth ) {
    this.cube.rotateLeftClockwise( depth )
    this.cube.rotateLeftClockwise( depth )
    this.cube.rotateLeftClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateLeftCounterclockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateUpCounterclockwise( depth ) {
    this.cube.rotateUpClockwise( depth )
    this.cube.rotateUpClockwise( depth )
    this.cube.rotateUpClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateUpCounterclockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  rotateDownCounterclockwise( depth ) {
    this.cube.rotateDownClockwise( depth )
    this.cube.rotateDownClockwise( depth )
    this.cube.rotateDownClockwise( depth )

    const animation = this.#createAnimationFunction( 
      this.#animateDownCounterclockwise
    ).bind( this )

    this.#startAnimation( animation, depth )
  }

  // #endregion 

  // #endregion

  /**
   * Creates a function for animating a side.
   * @param { () => any } updateFunction 
   * @param { ( time: number, depth: number ) => any } animationFunction 
   * @returns 
   */
  #createAnimationFunction( animationFunction ) {
    animationFunction = animationFunction.bind( this )
    let objThis = this
    return function Animation(){
      if( this.animation.depth == null ){
        console.log( "Animation lacks depth variable, ignoring." )
        return
      }

      let progress = this.getAnimationProgress()

      if( progress > 1 ) {
        animationFunction( 0, this.animation.depth )
        this.animation.playing = false;
        this.updateAllTilesClasses()
      } else {
        animationFunction( progress, this.animation.depth )
        requestAnimationFrame( Animation.bind( objThis ) )
      }
    }.bind( this )
  }

  /**
   * Gets the animation progress variable.
   * If the value exceeds 1, finish the animation.
   */
  getAnimationProgress() {
    let now = Date.now()
    let elapsed = now - this.animation.start
    let progress = elapsed / this.animation.time 

    return progress
  }
}

/** @global */
const rubik = new RubikDOM( 3 )

function addEvent( buttonID, event ){
  const button = document.getElementById( buttonID )

  event = event.bind( rubik )

  button.addEventListener( "click", ()=>{ 
    if( !rubik.animation.playing )event(0)      
  })
}

rubik.setAnimationTime( 200 )

addEvent( "frontClockwise", rubik.rotateFrontClockwise )
addEvent( "rightClockwise", rubik.rotateRightClockwise )
addEvent( "backClockwise", rubik.rotateBackClockwise )
addEvent( "leftClockwise", rubik.rotateLeftClockwise )
addEvent( "upClockwise", rubik.rotateUpClockwise )
addEvent( "downClockwise", rubik.rotateDownClockwise )

addEvent( "frontCounterclockwise", rubik.rotateFrontCounterclockwise )
addEvent( "rightCounterclockwise", rubik.rotateRightCounterclockwise )
addEvent( "backCounterclockwise", rubik.rotateBackCounterclockwise )
addEvent( "leftCounterclockwise", rubik.rotateLeftCounterclockwise )
addEvent( "upCounterclockwise", rubik.rotateUpCounterclockwise )
addEvent( "downCounterclockwise", rubik.rotateDownCounterclockwise )