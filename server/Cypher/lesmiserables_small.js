var exports = module.exports = {};

exports.nodes =  [
                {
                    positionId: 0,
                    name: "Myriel",
                    group: 1,
                    CLASSIFICATIONID:'CSERV'
                }, {
                    positionId: 1,
                    name: "Napoleon",
                    group: 1,
                    CLASSIFICATIONID:'A'
                }, {
                    positionId: 2,
                    name: "Mlle.Baptistine",
                    group: 1,
                    CLASSIFICATIONID:'A'
                },  {
                    positionId: 11,
                    name: "Valjean",
                    group: 2,
                    CLASSIFICATIONID:'CSERV'
                },  {
                    positionId: 15,
                    name: "Gervais",
                    group: 2,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 16,
                    name: "Tholomyes",
                    group: 3,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 17,
                    name: "Listolier",
                    group: 3,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 18,
                    name: "Fameuil",
                    group: 3,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 19,
                    name: "Blacheville",
                    group: 3,
                    CLASSIFICATIONID:'D'
                }];

exports.links =  [{
                        source: 1,
                        target: 0,
                        value: 1
                    }, {
                        source: 2,
                        target: 0,
                        value: 8
                    },  {
                        source: 11,
                        target: 2,
                        value: 3
                    },{
                        source: 11,
                        target: 0,
                        value: 3
                    }, {
                        source: 15,
                        target: 11,
                        value: 1
                    }, {
                        source: 17,
                        target: 16,
                        value: 4
                    }, {
                        source: 18,
                        target: 16,
                        value: 4
                    }, {
                        source: 18,
                        target: 17,
                        value: 4
                    }, {
                        source: 19,
                        target: 16,
                        value: 4
                    }, {
                        source: 19,
                        target: 17,
                        value: 4
                    }, {
                        source: 19,
                        target: 18,
                        value: 4
                    }
                 ];
exports.icons = {
                icons: [
                    {classificationId: 'A', iconName: 'content/img/bee.png'},
                    {classificationId: 'B', iconName: 'content/img/doubleswoosh.png'},
                    {classificationId: 'C', iconName: 'content/img/fire.png'},
                    {classificationId: 'D', iconName: 'content/img/gradhat.png'},
                    {classificationId: 'CSERV', iconName: 'content/img/blackstar.png'},

                ]
        };
    
