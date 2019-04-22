
## Some Dev Notes

### Build the dist file

```
rollup -c
```

---

### Get the gzip size: 

```
npx gzip-size ./dist/relift.min.js
```


### Brotli compress
npx brotli-cli ./dist/relift.min.js

### filesize

npx filesize-cli ./dist/relift.min.js