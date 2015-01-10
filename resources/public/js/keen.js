var keen = (function () {

  var client = new Keen({
    projectId: "54b1330e96773d221315facf",
    writeKey: "d060d43687a3ff4c53f202f21e8c569587bd5ac9d79ee4203fd0251c14bef49a1f87e02ab8ff107361d4828d1ea2e370888c5486118fe2a4368054c37bb928df5e6cc03ff3b82a28c36fa0271f323b31a24c59f341e02edee20343ca5856b0806e559163e0da4f6192d5d60428d5ed58",
    readKey: "efba5fa7b56f19ded7e6cbb5b51d547bf05688c362a8a106099e0a99210896e02ec61bd7de5d330ab4100d66631d3e5dc626983e70e7334422d8192e9b61fc455a3eb7b8c7992596cd1c865a1c4a58c6227c36cd597569cd7a99081b624cdcc76e70d1f40a8ff22208b7af47138c806b"
  })

  function view(id, owner, viewer) {
    client.addEvent("pageviews",
      {
        eid: id,
        version: "full",
        owner: owner,
        viewer: viewer,
        keen: {
          timestamp: new Date().toISOString()
        }
      })
  }

  function count(id, f) {
    var countQuery = new Keen.Query("count", {
      eventCollection: "pageviews",
      eid: id
    });
    client.run(countQuery, f)
  }

  return { view: view, count: count}
})()
