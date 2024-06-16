const cds = require("@sap/cds");

module.exports = async (srv) => {
    const { SalesOrders, MappingCustomers, Customers } = srv.entities;

    // connect to S/4HANA
    const S4_Service = await cds.connect.to("SalesOrderA2X");
    srv.on("READ", SalesOrders, async (req) => {
        return await S4_Service.send({
            query: req.query,
            headers: {
                apikey: process.env.apikey,
                Accept: "application/json"
            },
        });
    })

    srv.after("READ", SalesOrders, async (data) => {
        const orders = Array.isArray(data) ? data : [data];

        orders.forEach(async (order) => {
            let mapping = await SELECT.one.from(MappingCustomers).where({
                s4CustomerId: order.customer
            })

            if (mapping) {
                order.customerId = mapping.nwCustomerId;
                order.customerName = mapping.nwCustomerName;
            } else {
                order.customerId = "No mapping found...";
                order.customerName = "No mapping found...";
            }

        })
    })
}