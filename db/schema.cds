namespace com.sap;

using
{
    Country,
    Currency,
    Language,
    User,
    cuid,
    extensible,
    managed,
    temporal
}
from '@sap/cds/common';

entity MappingCustomers
{
    key ID : UUID;
    s4CustomerId : String(100);
    s4CustomerName : String(100);
    nwCustomerId : String(100);
    nwCustomerName : String(100);
}
