const router = require('express').Router();

router.post('/test', function(req, res) {
  res.json({requestBody: req.body});
})

module.exports = router;

// fetch('/api/test', {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": "En2RUxFv-It_FzSHNYha94RUm0NoUmmU74Ao"
//   },
//   body: JSON.stringify({ hello: 'world' })
// }).then(res => res.json()).then(data => console.log(data));