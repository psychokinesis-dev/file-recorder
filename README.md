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
  -H 'postman-token: a79fe319-97e6-0bab-6712-474a2d82e52e' \
  -d '{
	"name": "中文.mp4",
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

### detail-file
获取文件详细信息（分片）
```bash
curl -X GET \
  'http://127.0.0.1:3000/v1/detail-file?id=1' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 2e80c335-90b1-7079-953d-8dd6bf6a6a18' \
  -d '{
	"name": "中文.mp4",
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