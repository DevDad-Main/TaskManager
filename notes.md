# Notes:

# Backup Data:

> Optional command to backup our database and then restore it.

```bash
# Export all data
docker exec fullstack-db pg_dump -U prisma fullstack > backup.sql

# Restore later
cat backup.sql | docker exec -i fullstack-db psql -U prisma fullstack
```
