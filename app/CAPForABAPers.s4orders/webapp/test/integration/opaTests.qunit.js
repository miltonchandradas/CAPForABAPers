sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'CAPForABAPers/s4orders/test/integration/FirstJourney',
		'CAPForABAPers/s4orders/test/integration/pages/CustomersList',
		'CAPForABAPers/s4orders/test/integration/pages/CustomersObjectPage',
		'CAPForABAPers/s4orders/test/integration/pages/S4SalesOrdersObjectPage'
    ],
    function(JourneyRunner, opaJourney, CustomersList, CustomersObjectPage, S4SalesOrdersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('CAPForABAPers/s4orders') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCustomersList: CustomersList,
					onTheCustomersObjectPage: CustomersObjectPage,
					onTheS4SalesOrdersObjectPage: S4SalesOrdersObjectPage
                }
            },
            opaJourney.run
        );
    }
);