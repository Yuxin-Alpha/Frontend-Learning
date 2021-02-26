const baseHandlers = {
	get(target, key) {
		if(typeof target[key] === 'object') {
			return reactive(target[key])
		}
	}
}

const reactive = (target) => {
	return new Proxy(target, baseHandlers)
}