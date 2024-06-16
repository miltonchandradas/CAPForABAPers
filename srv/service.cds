using { SalesOrderA2X } from './external/SalesOrderA2X.cds';

using { northwind } from './external/northwind.cds';

using { com.sap as my } from '../db/schema';

@path : '/service/CAPForABAPersSvcs'
service SalesService
{
    @readonly
    entity MappingCustomers as
        projection on my.MappingCustomers;

    entity S4SalesOrders as projection on SalesOrderA2X.A_SalesOrder
    {
        SalesOrder as salesOrder,
        SoldToParty as customer,
        SalesOrderDate as salesOrderDate,
        TotalNetAmount as totalAmount,
        OverallDeliveryStatus as status
    };

    entity Customers as projection on northwind.Customers
    {
        CustomerID as customerId,
        CompanyName as customerName,
        ContactName as contactName,
        Address as address,
        City as city,
        PostalCode as zipcode,
        Country as country,
        Phone as phone
    };
}

annotate SalesService with @requires :
[
    'authenticated-user'
];
