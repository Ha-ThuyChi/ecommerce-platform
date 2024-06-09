const Promotion = require("../models").promotion;

exports.createPromotion = async (req, res) => {
    try {
        await Promotion.create({
            code: req.body.code,
            percentage: req.body.percentage,
            expireDate: req.body.expireDate,
        });
        res.status(200).send({status: true, message: "Promotion is created."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};
exports.deletePromotion = async (req, res) => {
    try {
        const isDelete = await Promotion.destroy({
            where: {
                id: req.params.promotionId,
            }
        });
        if (!isDelete) {
            res.status(404).send({status: false, message: "Promotion is not found."});
            return;
        }
        res.status(200).send({status: true, message: "Promotion is deleted."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.viewPromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findOne({
            id: req.params.promotionId,
        });
        if (promotion == null) {
            res.status(404).send({status: false, message: "Promotion is not found."});
            return;
        }
        res.status(200).send({status: true, message: promotion});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};

exports.editPromotion = async (req, res) => { 
    try {
        const isEdit = await Promotion.update(
            {
                code: req.body.code,
                percentage: req.body.percentage,
                expireDate: req.body.expireDate,
            },{
                where: {
                    id: req.body.promotionId
            }}
        );
        if (isEdit != 1) {
            res.status(404).send({status: false, message: "Promotion is not found."});
            return;
        }
        res.status(200).send({status: true, message: "Promotion is updated."});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    };
};