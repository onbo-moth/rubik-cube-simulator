class RubikCube {
  /**
   * @param { number } size Side length of the cube in tiles.
   */
  constructor( size ) {
    this.size = size

    this.cube = {
      front: new Array2D( size, size ).fill( 0 ),
      right: new Array2D( size, size ).fill( 1 ),
      back:  new Array2D( size, size ).fill( 2 ),
      left:  new Array2D( size, size ).fill( 3 ),
      up:    new Array2D( size, size ).fill( 4 ),
      down:  new Array2D( size, size ).fill( 5 )
    }
  }
  
  // #region Rubik Cube Rotations

  /**
   * Rotate the front of the cube clockwise.
   * @param { number } depth 
   */
  rotateFrontClockwise( depth ) {
    this.#checkDepthErrors( depth )

    const lastIndex = this.size - 1

    if( depth === 0 ) {
      this.cube.front = this.cube.front.rotateClockwise()
    }

    if( depth === lastIndex ) {
      this.cube.back = this.cube.back.rotateCounterclockwise()
    }

    const upRow       = this.cube.up.getRow( lastIndex - depth )
    const rightColumn = this.cube.right.getColumn( depth )
    const downRow     = this.cube.down.getRow( depth )
    const leftColumn  = this.cube.left.getColumn( lastIndex - depth )

    const newUpRow       = leftColumn.rotateClockwise()
    const newRightColumn = upRow.rotateClockwise()
    const newDownRow     = rightColumn.rotateClockwise()
    const newLeftColumn  = downRow.rotateClockwise()

    this.cube.up.setRow( newUpRow, lastIndex - depth )
    this.cube.right.setColumn( newRightColumn, depth )
    this.cube.down.setRow( newDownRow, depth )
    this.cube.left.setColumn( newLeftColumn, lastIndex - depth )
  }

  /**
   * Rotate the right of the cube clockwise.
   * @param { number } depth 
   */
  rotateRightClockwise( depth ){
    this.#checkDepthErrors( depth )

    const lastIndex = this.size - 1

    if( depth === 0 ){
      this.cube.right = this.cube.right.rotateClockwise()
    }

    if( depth === lastIndex ){
      this.cube.left = this.cube.left.rotateCounterclockwise()
    }

    const upColumn    = this.cube.up.getColumn( lastIndex - depth )
    const frontColumn = this.cube.front.getColumn( lastIndex - depth )
    const downColumn  = this.cube.down.getColumn( lastIndex - depth )
    const backColumn  = this.cube.back.getColumn( depth )

    const newUpColumn = frontColumn
    const newFrontColumn = downColumn
    const newDownColumn = backColumn.flipColumns()
    const newBackColumn = upColumn.flipColumns()

    this.cube.up.setColumn( newUpColumn, lastIndex - depth )
    this.cube.front.setColumn( newFrontColumn, lastIndex - depth )
    this.cube.down.setColumn( newDownColumn, lastIndex - depth )
    this.cube.back.setColumn( newBackColumn, depth )
  }

  /**
   * Rotate the back of the cube clockwise.
   * @param { number } depth 
   */
  rotateBackClockwise( depth ){
    this.#checkDepthErrors( depth )

    const lastIndex = this.size - 1

    if( depth === 0 ){
      this.cube.back = this.cube.back.rotateClockwise()
    }

    if( depth === lastIndex ){
      this.cube.front = this.cube.front.rotateCounterclockwise()
    }

    const upRow       = this.cube.up.getRow( depth )
    const leftColumn  = this.cube.left.getColumn( depth )
    const downRow     = this.cube.down.getRow( lastIndex - depth )
    const rightColumn = this.cube.right.getColumn( lastIndex - depth )

    const newUpRow       = rightColumn.rotateCounterclockwise()
    const newLeftColumn  = upRow.rotateCounterclockwise()
    const newDownRow     = leftColumn.rotateCounterclockwise()
    const newRightColumn = downRow.rotateCounterclockwise()

    this.cube.up.setRow( newUpRow, depth )
    this.cube.left.setColumn( newLeftColumn, depth )
    this.cube.down.setRow( newDownRow, lastIndex - depth )
    this.cube.right.setColumn( newRightColumn, lastIndex - depth )
  }

  rotateLeftClockwise( depth ){
    this.#checkDepthErrors( depth )

    const lastIndex = this.size - 1

    if( depth === 0 ){
      this.cube.left = this.cube.left.rotateClockwise()
    }

    if( depth === lastIndex ){
      this.cube.right = this.cube.right.rotateCounterclockwise()
    }

    const upColumn = this.cube.up.getColumn( depth )
    const frontColumn = this.cube.front.getColumn( depth )
    const downColumn = this.cube.down.getColumn( depth )
    const backColumn = this.cube.back.getColumn( lastIndex - depth )

    const newUpColumn    = backColumn.flipColumns()
    const newFrontColumn = upColumn
    const newDownColumn  = frontColumn
    const newBackColumn  = downColumn.flipColumns()

    this.cube.up.setColumn( newUpColumn, depth )
    this.cube.front.setColumn( newFrontColumn, depth )
    this.cube.down.setColumn( newDownColumn, depth )
    this.cube.back.setColumn( newBackColumn, lastIndex - depth )
  }

  rotateUpClockwise( depth ) {
    this.#checkDepthErrors( depth )

    const lastIndex = this.size - 1

    if( depth === 0 ){
      this.cube.up = this.cube.up.rotateClockwise()
    }

    if( depth === lastIndex ){
      this.cube.down = this.cube.down.rotateCounterclockwise()
    }

    const frontRow = this.cube.front.getRow( depth )
    const rightRow = this.cube.right.getRow( depth )
    const backRow  = this.cube.back.getRow( depth )
    const leftRow  = this.cube.left.getRow( depth )

    const newFrontRow = rightRow
    const newRightRow = backRow
    const newBackRow  = leftRow
    const newLeftRow  = frontRow

    this.cube.front.setRow( newFrontRow, depth )
    this.cube.right.setRow( newRightRow, depth )
    this.cube.back.setRow( newBackRow, depth )
    this.cube.left.setRow( newLeftRow, depth )
  }

  rotateDownClockwise( depth ) {
    this.#checkDepthErrors( depth )

    const lastIndex = this.size - 1

    if( depth === 0 ){
      this.cube.down = this.cube.down.rotateClockwise()
    }

    if( depth === lastIndex ){
      this.cube.up = this.cube.up.rotateCounterclockwise()
    }

    const frontRow = this.cube.front.getRow( lastIndex - depth )
    const rightRow = this.cube.right.getRow( lastIndex - depth )
    const backRow  = this.cube.back.getRow( lastIndex - depth )
    const leftRow  = this.cube.left.getRow( lastIndex - depth )

    const newFrontRow = leftRow
    const newRightRow = frontRow
    const newBackRow  = rightRow
    const newLeftRow  = backRow

    this.cube.front.setRow( newFrontRow, lastIndex - depth )
    this.cube.right.setRow( newRightRow, lastIndex - depth )
    this.cube.back.setRow( newBackRow, lastIndex - depth )
    this.cube.left.setRow( newLeftRow, lastIndex - depth )
  }

  // #endregion

  // #region Rubik Face Array Getters

  /**
   * Returns values of the front face.
   * @returns { Array2D< number > }
   */
  getFrontFaceValues() {
    return this.cube.front
  }

  /**
   * Returns values of the right face.
   * @returns { Array2D< number > }
   */
  getRightFaceValues() {
    return this.cube.right
  }

  /**
   * Returns values of the back face.
   * @returns { Array2D< number > }
   */
  getBackFaceValues() {
    return this.cube.back
  }

  /**
   * Returns values of the left face.
   * @returns { Array2D< number > }
   */
  getLeftFaceValues() {
    return this.cube.left
  }

  /**
   * Returns values of the up face.
   * @returns { Array2D< number > }
   */
  getUpFaceValues() {
    return this.cube.up
  }

  /**
   * Returns values of the down face.
   * @returns { Array2D< number > }
   */
  getDownFaceValues() {
    return this.cube.down
  }

  // #endregion

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

  log() {
    for( const [ key, value ] of Object.entries( this.cube ) ){
      console.log( key + ":" )
      console.table( value.getAll() )
    }
  }

}
