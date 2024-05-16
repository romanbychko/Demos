public with sharing class DemoLWCCommunication_LWCController {
	@AuraEnabled
	public static string exampleMethodNoAttr() {
		String exampleString = '';
		try {
			exampleString = 'Demo time :) '+System.now();
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}

		return exampleString;
	}

    @AuraEnabled(cacheable=true)
	public static string exampleMethod(String attr1, Boolean attr2, List<String> attr3) {
		String joinedAttrs = '';
		try {
			joinedAttrs = attr1+' - '+attr2+' - '+attr3;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}

		return joinedAttrs;
	}
}