exports.defineTags = function(dictionary) {
  dictionary.defineTag('inheritparams', {
    mustHaveValue: false,
    mustNotHaveDescription: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: (doclet, tag) => {
      if(!doclet.inheritparams) doclet.inheritparams = []
      const [name, offset] = (tag.value || '').split(':')
      doclet.inheritparams.push({name, offset: parseInt(offset, 10) || 0})
    }
  })
}

exports.handlers = {
  processingComplete: ({doclets}) => {
    const inheriting = longname => ({name}) => name !== longname && heirs[name]
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

      heirsArray.reduceRight((_, {
        longname,
        augments = [],
        params = [],
        inheritparams
      }, index) => {
        if(inheritparams.some(inheriting(longname))) return
        const overwrite = [...params]

        inheritparams.forEach(({name, offset}) => {
          if(!name && !(name = augments[0])) return
          const parent = subjects[name]

          if(!parent || !parent.params || name === longname) return
          if(offset < 0) offset = Math.max(0, offset + overwrite.length + 1)
          else if(offset > overwrite.length) offset = overwrite.length

          parent.params.forEach(param => {
            if(overwrite.some(({name}) => name === param.name)) return
            if(!heirs[longname].params) heirs[longname].params = params
            params.splice(params.indexOf(overwrite[offset]), 0, {
              inherited: name, ...param
            })
          })
        })

        delete heirs[longname]
        heirsArray.splice(index, 1)
      }, null)
    }
  }
}
