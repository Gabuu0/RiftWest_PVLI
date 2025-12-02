import WorldItem from "./item.js";

export default class Key extends WorldItem{
    constructor(scene,x,y,texture,textureInventory,animation,description,identifier){
        super(scene,x,y,texture,textureInventory,description,identifier);
        
        this.animation = animation;
        this.play(this.animation);
    }
}