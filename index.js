exports.defineTags = function(dictionary) {
  dictionary.defineTag('inheritparams', {
    mustHaveValue: false,
    mustNotHaveDescription: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: (doclet, tag) => {
      if(!doclet.inheritparams) doclet.inheritparams = []
      var [name, offset] = (tag.value || '').split(':')
      doclet.inheritparams.push({name, offset: parseInt(offset, 10) || 0})
    }
  })
}

exports.handlers = {
  processingComplete: ({doclets}) => {
    const subjects = {}
    const heirs = {}
    const heirsArray = []
    var count = 0

    doclets.forEach(doclet => {
      if(doclet.kind !== 'class' && doclet.kind !== 'function') return
      const existing = subjects[doclet.longname]
      if(existing && existing.params && existing.params.length) return
      subjects[doclet.longname] = doclet
      if(!doclet.inheritparams || !doclet.inheritparams.length) return
      heirs[doclet.longname] = doclet
      heirsArray.push(doclet)
    })

    while(count !== heirsArray.length) {
      count = heirsArray.length
      heirsArray.forEach(heir => {
        if(heir.inheritparams.some(({name}) => (
          name !== heir.longname && heirs[name]
        ))) {
          return
        }

        const length = heir.params ? heir.params.length : 0

        heir.inheritparams.forEach(({name, offset}) => {
          if(!name && heir.augments) name = heir.augments[0]
          if(!name) return

          const parent = subjects[name]

          if(!parent || !parent.params || name === heir.longname) return
          if(offset < 0) offset += length

          ;[...subjects[name].params].reverse().forEach(param => {
            if(heir.params && heir.params.some(({name}) => (
              name === param.name
            ))) {
              return
            }

            if(!heir.params) heir.params = []
            heir.params.splice(offset, 0, {inherited: name, ...param})
          })
        })

        delete heirs[heir.longname]
        heirsArray.splice(heirsArray.indexOf(heir), 1)
      })
    }
  }
}
