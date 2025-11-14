import Item from "./item.js";

export default class Key extends Item{
    constructor(scene,x,y,texture,textureInventory,animation,description){
        super(scene,x,y,texture,textureInventory,description);
        this.animation = animation;

        this.play(this.animation);

    }
}