const cds = require("@sap/cds");

module.exports = async (srv) => {
    const { SalesOrders } = srv.entities;

    // connect to S/4HANA
    const S4_Service = await cds.connect.to("SalesOrderA2X");
    srv.on("READ", SalesOrders, async (req) => {
        return await S4_Service.send({
            query: req.query,
            headers: {
                apikey: process.env.apikey,
             },
        });
    })
}