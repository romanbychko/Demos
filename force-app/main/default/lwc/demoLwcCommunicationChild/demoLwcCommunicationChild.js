import { LightningElement, api, wire } from 'lwc';
import DEMO_CHANNEL from "@salesforce/messageChannel/Demo_LWC_Communication__c";
import { publish, subscribe, MessageContext} from "lightning/messageService";

export default class DemoLwcCommunicationChild extends LightningElement {
    @api componentName = 'Child default name';

    @api attributeFromUpperLevel = 'default value';

    childAttr = 'Default child attr value';

    attrFromMessageChannel = '';

    @wire(MessageContext)
    messageContext;

    handleTextChange(e) {
        this.childAttr = e.target.value;
    }

    handlePassAttrToParent() {
        this.dispatchEvent(new CustomEvent("event_from_child", { detail: this.childAttr }));
    }

    handlePassAttrChannel() {
        publish(this.messageContext, DEMO_CHANNEL, {
            textAttr: this.childAttr
        });
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            DEMO_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        try {
            if (message.textAttr) {
                this.attrFromMessageChannel = message.textAttr;
            }
        } catch (error) {
            this.error = error;
            console.log('Error = ',error);
        }
    }
    
}