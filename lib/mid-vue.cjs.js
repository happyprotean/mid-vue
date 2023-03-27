'use strict';

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* SHAPE_FLAGS.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* SHAPE_FLAGS.ARRAY_CHILDREN */;
    }
    // 组件类型且children为对象时，表示传入了slots
    if (vnode.shapeFlag & 2 /* SHAPE_FLAGS.STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= 16 /* SHAPE_FLAGS.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVnode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* SHAPE_FLAGS.ELEMENT */ : 2 /* SHAPE_FLAGS.STATEFUL_COMPONENT */;
}

function h(type, props, children) {
    return createVnode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVnode(Fragment, {}, slot(props));
        }
    }
}

const extend = Object.assign;
function isObject(value) {
    return value && typeof value === 'object';
}
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
// add-foo => addFoo
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
};
const capitallize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? 'on' + capitallize(str) : '';
};

const targetMap = new Map();
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    if (!dep)
        return;
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function (target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function (target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn(`key: ${key} cannot be set, because target: ${target} is readonly`);
        return true;
    }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

function createActiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
        return target;
    }
    return new Proxy(target, baseHandlers);
}
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}

function emit(instance, event, ...rest) {
    const { props } = instance;
    const handler = props[toHandlerKey(camelize(event))];
    handler && handler(...rest);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    '$el': i => i.vnode.el,
    '$slots': i => i.slots,
};
const PublicInstanceHandlers = {
    get({ _: instance }, key) {
        // setupState
        const { setupState, props } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* SHAPE_FLAGS.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

let currentInstance = null;
function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        emit: () => { },
    };
    // 绑定components参数，避免用户在调用emit时，额外的参数传递, 如emit(instance, event)
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers);
    const component = instance.type;
    const { setup } = component;
    if (setup) {
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        });
        handleSetupResult(instance, setupResult);
        setCurrentInstance(null);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO: function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

function provide(key, value) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        // App根组件无parent
        if (currentInstance.parent) {
            const parentProvides = currentInstance.parent.provides;
            // 只能执行一次，在初始化是会将父组件的provides赋值给当前组件
            if (provides === parentProvides) {
                provides = currentInstance.provides = Object.create(parentProvides);
            }
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        if (!currentInstance.parent) {
            console.warn('根组件无父元素');
            return;
        }
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (typeof defaultValue === 'function') {
            return defaultValue();
        }
        else {
            return defaultValue;
        }
    }
}

function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                const vnode = createVnode(rootComponent);
                render(vnode, rootContainer);
            },
        };
    };
}

function createRenderer(options) {
    const { createElement, patchProp, insert } = options;
    function render(vnode, container) {
        // patch
        patch(vnode, container, null);
    }
    function patch(vnode, container, parentComponent) {
        // 处理组件
        // 通过位运算 & 判断shapeFlag类型
        const { type, shapeFlag } = vnode;
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & 1 /* SHAPE_FLAGS.ELEMENT */) {
                    processElement(vnode, container, parentComponent);
                }
                else if (shapeFlag & 2 /* SHAPE_FLAGS.STATEFUL_COMPONENT */) {
                    processComponent(vnode, container, parentComponent);
                }
                break;
        }
    }
    function processElement(vnode, container, parentComponent) {
        mountElement(vnode, container, parentComponent);
    }
    function mountElement(vnode, container, parentComponent) {
        const { type, props, children, shapeFlag } = vnode;
        const el = (vnode.el = createElement(type));
        if (shapeFlag & 4 /* SHAPE_FLAGS.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* SHAPE_FLAGS.ARRAY_CHILDREN */) {
            mountChildren(vnode, el, parentComponent);
        }
        for (const key in props) {
            const val = props[key];
            patchProp(el, key, val);
        }
        insert(el, container);
    }
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach((item) => {
            patch(item, container, parentComponent);
        });
    }
    function processComponent(vnode, container, parentComponent) {
        mountComponent(vnode, container, parentComponent);
    }
    function mountComponent(initialVnode, container, parentComponent) {
        const instance = createComponentInstance(initialVnode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, initialVnode, container);
    }
    function setupRenderEffect(instance, initialVnode, container) {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        // vnode => patch
        // vnode => element => mountElement
        patch(subTree, container, instance);
        initialVnode.el = subTree.el;
    }
    function processFragment(vnode, container, parentComponent) {
        mountChildren(vnode, container, parentComponent);
    }
    function processText(vnode, container) {
        const { children } = vnode;
        const textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode);
    }
    return {
        createApp: createAppAPI(render),
    };
}

function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, val) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, val);
    }
    else {
        el.setAttribute(key, val);
    }
}
function insert(el, parent) {
    parent.append(el);
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert,
});
function createApp(...rest) {
    return renderer.createApp(...rest);
}

exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.renderSlots = renderSlots;
