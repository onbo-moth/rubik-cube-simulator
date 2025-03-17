/**
 * Defines a two-dimensional array.
 * 
 * @template T
 * @global
 */
class Array2D {
  constructor( rows, columns ) {
    this.rows = rows
    this.columns = columns

    /** @type { T[][] } */
    this.array = []

    this.#initialize2DArray()
  }

  #initialize2DArray() {
    for( let row = 0; row < this.rows; row++ ){
      this.array.push( new Array( this.columns ))
    }
  }

  getRows() {
    return this.rows
  }

  getColumns() {
    return this.columns
  }

  /**
   * Gets a single value off of a 2D array.
   * 
   * @param { number } row 
   * @param { number } column 
   * @returns { T }
   */
  get( row, column ) {
    return this.array[ row ][ column ]
  }

  /**
   * Gets the entire 2D array.
   * 
   * @returns { T[][] }
   */
  getAll() {
    return this.array
  }

  /**
   * Set a single value in the 2D array.
   * 
   * @param { number } row 
   * @param { number } column 
   * @param { T } value 
   */
  set( row, column, value ){
    if( row < 0 ) throw new Error( 
      "Row index is out of bounds." +
      ` ( got: ${ row } )`
    )

    if( row >= this.rows ) throw new Error( 
      "Row index is out of bounds." +
      ` ( got: ${ row }, rows: ${ this.rows } )`
    )

    if( column < 0 ) throw new Error( 
      "Column index is out of bounds." +
      ` ( got: ${ column } )`
    )

    if( column >= this.columns ) throw new Error( 
      "Column index is out of bounds." +
      ` ( got: ${ column }, rows: ${ this.columns } )`
    )

    this.array[ row ][ column ] = value
  }

  /**
   * Fill the entire 2D array with a single value.
   * 
   * @param { T } value 
   */
  fill( value ){
    for( let row = 0; row < this.rows; row++ ){
      for( let column = 0; column < this.columns; column++ ){
        this.array[ row ][ column ] = value
      }
    }

    return this
  }

  /**
   * Gets a row of the 2D array.
   * @throws When row index is out of bounds.
   * 
   * @param { number } row 
   * @returns { Array2D< T > } 2D array containing a single row.
   */
  getRow( row ) {
    if( row < 0 ) throw new Error( "Row index out of bounds: " + row );
    if( row >= this.array.length ) throw new Error( "Row index out of bounds: " + row );

    const rowArray = new Array2D( 1, this.columns )

    for( let index = 0; index < this.columns; index++ ){
      rowArray.set( 0, index, this.array[ row ][ index ] )
    }

    return rowArray
  }

  /**
   * Gets a column of the 2D array.
   * @throws When column index is out of bounds.
   * 
   * @param { number } column 
   * @returns { Array2D< T > } 2D array containing a single column.
   */
  getColumn( column ) {
    if( column < 0 ) throw new Error( "Column index out of bounds: " + column );
    if( column >= this.array.length ) throw new Error( "Column index out of bounds: " + column );

    const columnArray = new Array2D( this.rows, 1 )

    for( let index = 0; index < this.rows; index++ ){
      columnArray.set( index, 0, this.array[ index ][ column ] )
    }

    return columnArray
  }

  /**
   * Sets a whole row into the given index of the row.
   * 
   * @param { Array2D< T > } row 
   * @param { number } index 
   */
  setRow( row, index ) {
    if( index < 0 ) throw new Error(
      "Row index is out of bounds." +
      ` ( got: ${ index } )`
    )

    if( index >= this.rows ) throw new Error(
      "Row index is out of bounds." +
      ` ( got: ${ index }, rows: ${ this.rows } )`
    )

    const rowSize = row.getColumns()

    if( rowSize !== this.columns ) throw new Error(
      "Column amount of this and row don't match." +
      ` ( this: ${ this.columns }, row: ${ rowSize } )`
    )

    for( let column = 0; column < rowSize; column++ ){
      this.set( index, column, row.get( 0, column ) )
    }

    return this
  }

  /**
   * Sets a whole column into the given index of the column.
   * 
   * @param { Array2D< T > } column 
   * @param { number } index 
   */
  setColumn( column, index ) {
    if( index < 0 ) throw new Error(
      "Column index is out of bounds." +
      ` ( got: ${ index } )`
    )

    if( index >= this.columns ) throw new Error(
      "Column index is out of bounds." +
      ` ( got: ${ index }, columns: ${ this.columns } )`
    )

    const columnSize = column.getRows()

    if( columnSize !== this.rows ) throw new Error(
      "Row amount of this and column don't match." +
      ` ( this: ${ this.rows }, column: ${ columnSize } )`
    )

    for( let row = 0; row < columnSize; row++ ){
      this.set( row, index, column.get( row, 0 ) )
    }
  }

  /**
   * Makes a new 2D array with it's values flipped vertically.
   */
  flipColumns() {
    const copy = new Array2D( this.rows, this.columns )
    const lastRowIndex = this.rows - 1

    for( let row = 0; row < this.rows; row++ ){
      for( let column = 0; column < this.columns; column++ ){
        copy.set( row, column, this.get( lastRowIndex - row, column ) )
      }
    }

    return copy
  }

  /**
   * Makes a new 2D array with it's values flipped horizontally.
   */
  flipRows() {
    const copy = new Array2D( this.rows, this.columns )
    const lastColumnIndex = this.columns - 1

    for( let row = 0; row < this.rows; row++ ){
      for( let column = 0; column < this.columns; column++ ){
        copy.set( row, column, this.get( row, lastColumnIndex - column ) )
      }
    }

    return copy
  }

  transpose() {
    const copy = new Array2D( this.columns, this.rows )

    for( let row = 0; row < this.rows; row++ ){
      for( let column = 0; column < this.columns; column++ ){
        copy.set( column, row, this.get( row, column ) )
      }
    }

    return copy
  }

  clone() {
    const copy = new Array2D( this.columns, this.rows )

    for( let row = 0; row < this.rows; row++ ){
      for( let column = 0; column < this.columns; column++ ){
        copy.set( column, row, this.get( column, row ) )
      }
    }

    return copy
  }

  rotateClockwise() {
    return this.transpose().flipRows()
  }

  rotateCounterclockwise() {
    return this.flipRows().transpose()
  }

  *values() {
    for( const row of this.array ){
      for( const value of row ){
        yield value
      }
    }
  }
}

// #endregion