const Router = require('koa-router');
const Joi = require('joi');
const dateFormat = require('dateformat');


const router = new Router({
	prefix: '/v1'
});
exports = module.exports = router;


const createFileSchema = Joi.object().keys({
    name: Joi.string().required(),
    size: Joi.number().integer().required(),
    partitions: Joi.array().items(Joi.object().keys({
    	hash: Joi.string().required(),
    	meta: Joi.any()
    })).required()
});

router.post('/create-file', async(ctx) => {
	const params = ctx.request.body;

	const checkResult = Joi.validate(params, createFileSchema);
	if (checkResult.error) {
		ctx.status = 400;
		ctx.body = checkResult.error;
		return;
	}

	const partitions = params.partitions.map((p, i) => {
		return Object.assign(p, {sequence: i});
	});

	const db = ctx.db;
	const result = await db.File.create({
        meta: {
            name: params.name,
            size: params.size // B
        },
        partitions: partitions
    }, {
        include: [db.File.Partitions]
    });

	ctx.status = 200;
    ctx.body = {id: result.id};
});


const listFileSchema = Joi.object().keys({
    offset: Joi.number().integer(),
    limit: Joi.number().integer()
});

router.get('/list-file', async(ctx) => {
	const params = ctx.request.query;

	const checkResult = Joi.validate(params, listFileSchema);
	if (checkResult.error) {
		ctx.status = 400;
		ctx.body = checkResult.error;
		return;
	}

	const db = ctx.db;
	const result = await db.File.findAndCountAll({
        offset: params.offset || 0,
        limit: params.limit || 20,
        order: [
            ['createdAt', 'DESC']
        ]
    });

    ctx.status = 200;
    ctx.body = result;
});


const detailFileSchema = Joi.object().keys({
    id: Joi.number().integer().required()
});

router.get('/detail-file', async(ctx) => {
	const params = ctx.request.query;

	const checkResult = Joi.validate(params, detailFileSchema);
	if (checkResult.error) {
		ctx.status = 400;
		ctx.body = checkResult.error;
		return;
	}

	const db = ctx.db;
	const result = await db.File.findOne({
        where: {
            id: params.id
        },
        include: [db.File.Partitions]
    });

    if (result === null) {
    	ctx.status = 404;
		return;
    }

    ctx.status = 200;
    ctx.body = result;
});


const addContributerSchema = Joi.object().keys({
    contributor: Joi.string().required(),
    partition_hash: Joi.array().items(Joi.string()).required()
});

router.post('/add-contributor', async(ctx) => {
    const params = ctx.request.body;

    const checkResult = Joi.validate(params, addContributerSchema);
    if (checkResult.error) {
        ctx.status = 400;
        ctx.body = checkResult.error;
        return;
    }

    const dateString = dateFormat(new Date(), 'yyyy_mm_dd_HH_MM');

    const cache = ctx.cache;
    const partitions = params.partition_hash.map((p) => {
        cache.sadd(p + '-' + dateString, params.contributor, (err) => {
            if (err) return;  // TODO: handle the error

            cache.expire(p + '-' + dateString, 2 * 60);
        });
    });

    ctx.status = 200;
    ctx.body = {};
});


const listContributerSchema = Joi.object().keys({
    partition_hash: Joi.array().items(Joi.string()).required()
});

router.post('/list-contributor', async(ctx) => {
    const params = ctx.request.body;

    const checkResult = Joi.validate(params, listContributerSchema);
    if (checkResult.error) {
        ctx.status = 400;
        ctx.body = checkResult.error;
        return;
    }

    const cache = ctx.cache;

    const contributors = await Promise.all(params.partition_hash.map(async (p) => {
        const hashs = await cache.keys(p + '-*');
        const ps = hashs.map(h => cache.smembers(h));
        const contributorArray = await Promise.all(ps);

        const ca = [].concat.apply([], contributorArray);
        const union = new Set(ca);
        return Array.from(union);
    }));

    ctx.status = 200;
    ctx.body = {
        contributors: contributors
    };
});