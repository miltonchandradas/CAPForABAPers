const cds = require("@sap/cds");

module.exports = async (srv) => {
    const { MappingCustomers, Customers, S4SalesOrders, NorthwindCustomers } = srv.entities;

    // connect to S/4HANA
    const S4_Service = await cds.connect.to("SalesOrderA2X");

    // connect to Northwind
    const Northwind_Service = await cds.connect.to("northwind");

    srv.on("READ", Customers, async (req, next) => {
        if (!req.query.SELECT.columns) return next();

        const expandIndex = req.query.SELECT.columns.findIndex(
            ({ expand, ref }) => expand && ref[0] === "orders"
        );
        console.log(req.query.SELECT.columns);
        if (expandIndex < 0) return next();

        req.query.SELECT.columns.splice(expandIndex, 1);
        if (
            !req.query.SELECT.columns.find((column) =>
                column.ref.find((ref) => ref == "orders")
            )
        ) {
            req.query.SELECT.columns.push({ ref: ["orders_SalesOrder"] });
        }


        let customers = await Northwind_Service.send({
            query: SELECT.from(NorthwindCustomers).limit(5)
        })

        await Promise.all(
            customers.map(async (customer) => {
                let mapping = await SELECT.one.from(MappingCustomers).where({
                    nwCustomerId: customer.customerId
                })

                customer.s4CustomerId = mapping.s4CustomerId;
            })
        )

        try {
            customers = Array.isArray(customers) ? customers : [customers];
            
            return await Promise.all(
                customers.map(async (customer) => {
                    const orders = await S4_Service.send({
                        query: SELECT.from(S4SalesOrders)
                            .where({ customerId: customer.s4CustomerId })
                            .columns("salesOrder", "customerId", "salesOrderDate", "totalAmount", "status")
                            .limit(10),
                        headers: {
                            apikey: process.env.apikey,
                        },
                    });
                    customer.orders = orders;
                    return customer
                })
            );
        } catch (error) {
            console.log("Error: ", error)
         }
    })

    srv.on("READ", S4SalesOrders, async (req) => {
        return await S4_Service.send({
            // query: req.query,
            query: SELECT.from(S4SalesOrders)
                .columns("salesOrder", "customerId", "salesOrderDate", "totalAmount", "status")
                .limit(10),
            headers: {
                apikey: process.env.apikey,
                Accept: "application/json"
            },
        });
    })

    srv.after("READ", S4SalesOrders, async (data) => {
        const orders = Array.isArray(data) ? data : [data];

        orders.forEach(async (order) => {
            let mapping = await SELECT.one.from(MappingCustomers).where({
                s4CustomerId: order.customer
            })
        })
    })
}