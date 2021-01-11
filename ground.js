class Ground
{
    constructor()
    {
        this.body = createSprite(trex.x + 1200, 180, 2400, 20)
        this.body.addImage(groundImage);
    }
}