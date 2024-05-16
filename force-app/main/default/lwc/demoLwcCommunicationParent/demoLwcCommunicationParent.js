import { LightningElement, api, wire } from 'lwc';
import exampleMethodNoAttrApex from '@salesforce/apex/DemoLWCCommunication_LWCController.exampleMethodNoAttr';
import exampleMethodApex from '@salesforce/apex/DemoLWCCommunication_LWCController.exampleMethod';

import DEMO_CHANNEL from "@salesforce/messageChannel/Demo_LWC_Communication__c";
import { subscribe, MessageContext} from "lightning/messageService";

const ATTR3_OPTIONS = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' }
];
export default class DemoLwcCommunicationParent extends LightningElement {
	@api componentName = 'Parent default name';

	options = ATTR3_OPTIONS;

	attr1 = 'default value attr 1';
	attr2 = false;
	attr3 = this.options[1].value;

	wireResult = '';
	imperativeResult = '';
	fromChildEventResult = '';
	fromMessageChannel = '';
	error;

	@wire(MessageContext)
    messageContext;

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
                this.fromMessageChannel = message.textAttr;
            }
        } catch (error) {
            this.error = error;
            console.log('Error = ',error);
        }
    }

	handleTextChange(e) {
		this.attr1 = e.target.value;
		console.log('attr1 = ', this.attr1);
	}

	handleCheckboxChange(e) {
		this.attr2 = e.target.checked;
		console.log('attr2 = ', this.attr2);
	}

	handleCheckboxGroupChange(e) {
		this.attr3 = e.target.value;
		console.log('attr3 = ', JSON.stringify(this.attr3));
	}

	callApexMethodsImperatively() {
		console.log('Calling Apex on click (Imperatively)');
		exampleMethodNoAttrApex()
        .then(result1 => {
			console.log('Result 1 - ', result1);
            return exampleMethodApex({attr1 : result1, attr2 : this.attr2, attr3 : this.attr3});
        })
        .then(result2 => {
			console.log('Result 2 - ', result2);
            this.imperativeResult = result2;
        })
        .catch(error => {
            this.error = error;
            console.log('Error = ',error);
        });
	}

	@wire(exampleMethodApex, {attr1 : '$attr1', attr2 : '$attr2', attr3 : '$attr3'})
    exampleMethodApex({ error, data }) {
		console.log('Calling Apex using WIRE');
        if (data) {
            this.wireResult = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log('Error = ',error);
        }
    }

	handleChildEvent(e) {
		if(e.detail) {
			this.fromChildEventResult = e.detail;
		}
	}
}