# file-recorder
一个基于数据库（可支持Postgres, MySQL, SQLite, Microsoft SQL Server）的 RESTful 接口服务，用于记录文件信息，以备网络中的其他节点查找。

## API
### create-file
创建文件。
```bash
curl -X POST \
  http://127.0.0.1:3000/v1/create-file \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 3974a42d-5204-692b-1334-35af6c2cc260' \
  -d '{
	"name": "filename.mp4",
	"size": 1234,
	"partitions": [{
		"hash": "123456789",
		"meta": {}
	}, {
		"hash": "234567891",
		"meta": {}
	}]
}'
```

### list-file
拉取文件
```bash
curl -X GET \
  'http://127.0.0.1:3000/v1/list-file?offset=0&limit=10' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: a79fe319-97e6-0bab-6712-474a2d82e52e'
```

### detail-file
获取文件详细信息（分片）
```bash
curl -X GET \
  'http://127.0.0.1:3000/v1/detail-file?id=1' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 2e80c335-90b1-7079-953d-8dd6bf6a6a18'
```

### add-contributor
为一系列区块添加贡献者
```bash
curl -X POST \
  http://127.0.0.1:3000/v1/add-contributor \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: fac5748b-0d0e-0c69-5ebc-8c1d2b42aeee' \
  -d '{
    "contributor": "abcdefghijk",
    "partition_hash": ["qweasdzxc", "rtyfgh"]
}'
```

### list-contributor
获取区块的贡献者列表
```bash
curl -X POST \
  http://127.0.0.1:3000/v1/list-contributor \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 2159955e-1f60-1f17-35f6-fc9565bce313' \
  -d '{
    "partition_hash": ["qweasdzxc", "rtyfgh"]
}'
```