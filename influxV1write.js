/**
 * Created by irekromaniuk on 11/21/2016.
 */

const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: '1.1.1.1',
    database: 'tmp',
    username : 'dev',
    password : 'dev123',
    schema: [
        {
            measurement: 'cpu',
            fields: {
                cpu: Influx.FieldType.INTEGER
            },
            tags: [
                'site', 'firewall', 'dsp', 'coreid'
            ]
        }
    ]
})

influx.writePoints([
    {
        measurement: 'cpu',
        tags: { site: 'DC1', firewall: 'PAN2', dsp: 0, coreid: 1  },
        fields: { cpu: 55 },
    }
]).then(() => {
    return influx.query(`
    select * from cpu
    where firewall = 'PAN2'
    order by time desc
    limit 10
  `)
}).then(rows => {
    rows.forEach(row => console.log(`A request to ${row.path} took ${row.duration}ms`))
})