class Tile3D {
  static scene = $(".scene");

  /**
   *
   * @param { number } x X position of the tile.
   * @param { number } y Y position of the tile.
   * @param { number } rx Initial X rotation.
   * @param { number } ry Initial Y rotation.
   * @param { number } rz Initial Z rotation.
   * @param { string[] } classList Initial class list.
   */
  constructor(x, y, rx, ry, rz, classList) {
    this.x = x;
    this.y = y;

    // Constant initial rotations.
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;

    // Variable additional rotations.
    this.Arx = 0;
    this.Ary = 0;
    this.Arz = 0;

    this.tile = $("<div></div>");

    this.#setCSSVariables(classList);

    Tile3D.scene.append(this.tile);
  }

  #setCSSVariables(classList) {
    this.tile.css("--x", this.x);
    this.tile.css("--y", this.y);

    this.tile.css("--rx", this.rx + "deg");
    this.tile.css("--ry", this.ry + "deg");
    this.tile.css("--rz", this.rz + "deg");

    for (const className of classList) {
      this.tile.addClass(className);
    }
  }

  #updateCSSVariables() {
    // Total rotations.
    const tx = this.rx + this.Arx
    const ty = this.ry + this.Ary
    const tz = this.rz + this.Arz

    this.tile.css("--rx", tx + "deg");
    this.tile.css("--ry", ty + "deg");
    this.tile.css("--rz", tz + "deg");
  }

  addClass(cssClass) {
    this.tile.addClass(cssClass);
  }

  removeClass(cssClass) {
    this.tile.removeClass(cssClass);
  }

  setRelativeRotations( arx, ary, arz ){
    this.Arx = arx
    this.Ary = ary
    this.Arz = arz

    this.#updateCSSVariables()
  }

  remove() {
    this.tile.remove();
  }
}
