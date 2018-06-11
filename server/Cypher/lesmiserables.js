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
                }, {
                    positionId: 3,
                    name: "Mme.Magloire",
                    group: 1,
                    CLASSIFICATIONID:'B'
                }, {
                    positionId: 4,
                    name: "CountessdeLo",
                    group: 1,
                    CLASSIFICATIONID:'B'
                },{
                    positionId: 5,
                    name: "Geborand",
                    group: 1,
                    CLASSIFICATIONID:'B'
                }, {
                    positionId: 6,
                    name: "Champtercier",
                    group: 1,
                    CLASSIFICATIONID:'C'
                }, {
                    positionId: 7,
                    name: "Cravatte",
                    group: 1,
                    CLASSIFICATIONID:'C'
                }, {
                    positionId: 8,
                    name: "Count",
                    group: 1,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 9,
                    name: "OldMan",
                    group: 1,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 10,
                    name: "Labarre",
                    group: 2,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 11,
                    name: "Valjean",
                    group: 2,
                    CLASSIFICATIONID:'CSERV'
                }, {
                    positionId: 12,
                    name: "Marguerite",
                    group: 3,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 13,
                    name: "Mme.deR",
                    group: 2,
                    CLASSIFICATIONID:'D'
                }, {
                    positionId: 14,
                    name: "Isabeau",
                    group: 2,
                    CLASSIFICATIONID:'D'
                }, {
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
                }, {
                    positionId: 20,
                    name: "Favourite",
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
                    }, {
                        source: 3,
                        target: 0,
                        value: 10
                    }, {
                        source: 3,
                        target: 2,
                        value: 6
                    }, {
                        source: 4,
                        target: 0,
                        value: 1
                    }, {
                        source: 5,
                        target: 0,
                        value: 1
                    }, {
                        source: 6,
                        target: 0,
                        value: 1
                    }, {
                        source: 7,
                        target: 0,
                        value: 1
                    }, {
                        source: 8,
                        target: 0,
                        value: 2
                    }, {
                        source: 9,
                        target: 0,
                        value: 1
                    }, {
                        source: 11,
                        target: 10,
                        value: 1
                    }, {
                        source: 11,
                        target: 3,
                        value: 3
                    }, {
                        source: 11,
                        target: 2,
                        value: 3
                    }, {
                        source: 11,
                        target: 0,
                        value: 5
                    }, {
                        source: 12,
                        target: 11,
                        value: 1
                    }, {
                        source: 13,
                        target: 11,
                        value: 1
                    }, {
                        source: 14,
                        target: 11,
                        value: 1
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
                    }, {
                        source: 20,
                        target: 16,
                        value: 3
                    }, {
                        source: 20,
                        target: 17,
                        value: 3
                    }, {
                        source: 20,
                        target: 18,
                        value: 3
                    }, {
                        source: 20,
                        target: 19,
                        value: 4
                }];
exports.icons = {
                icons: [
                    {classificationId: 'A', iconName: 'img/bee.png'},
                    {classificationId: 'B', iconName: 'img/doubleswoosh.png'},
                    {classificationId: 'C', iconName: 'img/fire.png'},
                    {classificationId: 'D', iconName: 'img/gradhat.png'},
                ]
        };
    
