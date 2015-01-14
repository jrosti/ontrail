var keen = (function () {

  var client = new Keen({
    projectId: "54b1330e96773d221315facf",
    writeKey: "d060d43687a3ff4c53f202f21e8c569587bd5ac9d79ee4203fd0251c14bef49a1f87e02ab8ff107361d4828d1ea2e370888c5486118fe2a4368054c37bb928df5e6cc03ff3b82a28c36fa0271f323b31a24c59f341e02edee20343ca5856b0806e559163e0da4f6192d5d60428d5ed58"
  })

  function view(id, owner, viewer) {
    if (viewer !== owner) {
      client.addEvent("pageviews",
        {
          eid: id,
          version: "full",
          owner: owner,
          viewer: viewer ? viewer : "nobody",
          keen: {
            timestamp: new Date().toISOString()
          }
        })
    }
  }

  function count(id, f) {
    $.get("/rest/v1/keen/count/" + id, f)
  }

  return { view: view, count: count}
})()
