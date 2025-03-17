class Dynamic3DRotation {
  instance = null

  constructor( ){
    if( this.instance ) throw new Error( "Instance already exists" )

    this.instance = this
    this.dragMulti = 1 / 3

    this.xInvert = true
    this.yInvert = false

    this.perspective = 400 // px

    this.xRotation = 0 // deg
    this.yRotation = 0 // deg

    this.container = $( ".container" )
    this.scene = $( ".scene" )

    this.setCSSVariables()
    this.setMouseMoveListener()
  }

  setCSSVariables() {
    this.scene.css( "--perspective", this.perspective + "px" )
    this.scene.css( "--rx", this.xRotation + "deg" )
    this.scene.css( "--ry", this.yRotation + "deg" )
  }

  setMouseMoveListener() {
    this.container.on( "mousemove", function( jqueryEvent ){
      /** 
       * JQuery mouse events don't handle mouse movement values.
       * @type { MouseEvent } 
      */
      const event = jqueryEvent.originalEvent

      if( event.buttons !== 1 ) return

      const xInvertValue = this.xInvert ? -1 : 1
      const yInvertValue = this.yInvert ? -1 : 1

      this.xRotation += event.movementY * this.dragMulti * xInvertValue
      this.yRotation += event.movementX * this.dragMulti * yInvertValue

      this.setCSSVariables()

      event.preventDefault()
    }.bind( this ) )
  }

  getInstance() {
    if( !this.instance ) new Dynamic3DRotation()

    return this.instance
  }
}

/** @global */
const rotation = new Dynamic3DRotation()