import type { User } from "@/models";

// export interface interface {
//     sender: User;
//     body: string;
//     time: Date;
// }

export class Message{
    sender: User
    sendTime: Date

    constructor(sender: User, sendTime: Date){
        this.sender = sender;
        this.sendTime = sendTime;
    }

    // get sender(){return this.sender;}
    // get sendTime(){return this.sendTime;}
    
    public get_body(){
        console.debug("Message");
        return "Message"
    };

    public operator_more<bool>(one: Message){
        return (this.sendTime > one.sendTime);
    }
}



export class Message_text extends Message{
    #body: string

    constructor(sender: User, sendTime: Date, body: string){
        super(sender, sendTime);

        this.#body = body;
    }

    get body(){
        return this.body;
    }
    public get_body(){
        console.debug("Message_text");
        return this.#body;
    }

    set body(body: string){
        this.body = body;
    }
}