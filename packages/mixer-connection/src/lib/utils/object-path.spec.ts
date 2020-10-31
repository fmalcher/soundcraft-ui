import { getObjectPath, setObjectPath } from './object-path';

function easyClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

describe('object-path', () => {
  let o;

  beforeEach(() => {
    o = {
      foo: {
        bar: {
          x: {
            y: 5,
            z: 7,
          },
          v: 8,
        },
      },
      fooz: {
        zz: 6,
        myArr: [
          { a: 1, b: 2 },
          { a: 3, b: 4 },
          { a: 5, b: 6 },
        ],
      },
    };
  });

  it('should get literal from nested path', () => {
    const path = ['foo', 'bar', 'x', 'y'];
    const result = getObjectPath(o, path);
    expect(result).toMatchInlineSnapshot(`5`);
  });

  it('should get object from nested path', () => {
    const path = ['foo', 'bar', 'x'];
    const result = getObjectPath(o, path);
    expect(result).toMatchInlineSnapshot(`
          Object {
            "y": 5,
            "z": 7,
          }
        `);
  });

  it('should return full object when no path given', () => {
    const result = getObjectPath(o);
    expect(result).toEqual(o);
  });

  it('should return default value for unknown path', () => {
    const path = ['foo', 'xxxxx'];
    const defaultValue = 'peace';
    const result = getObjectPath(o, path, 'peace');
    expect(result).toEqual(defaultValue);
  });

  it('should walk through arrays with number index', () => {
    const path = ['fooz', 'myArr', 1, 'b'];
    const result = getObjectPath(o, path);
    expect(result).toMatchInlineSnapshot(`4`);
  });

  it('should walk through arrays with string index', () => {
    const path = ['fooz', 'myArr', '0'];
    const result = getObjectPath(o, path);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "a": 1,
        "b": 2,
      }
    `);
  });

  it('should set values in existing path', () => {
    const path = ['foo', 'bar', 'x', 'y'];
    const result = setObjectPath(o, path, 8);

    const clone = easyClone(o);
    expect(o).toEqual(clone);

    clone.foo.bar.x.y = 8;
    expect(result).toEqual(clone);
  });

  it('should set values in arrays with number index', () => {
    const path = ['fooz', 'myArr', 1, 'a'];
    const result = setObjectPath(o, path, 'YYY');

    const clone = easyClone(o);
    expect(o).toEqual(clone);

    clone.fooz.myArr[1].a = 'YYY';
    expect(result).toEqual(clone);
  });

  it('should set values in arrays with string index', () => {
    const path = ['fooz', 'myArr', '0', 'b'];
    const result = setObjectPath(o, path, 'ZZZ');

    const clone = easyClone(o);
    expect(o).toEqual(clone);

    clone.fooz.myArr[0].b = 'ZZZ';
    expect(result).toEqual(clone);
  });

  it('should create new branches', () => {
    const path = ['fooz', 'new'];
    const newBranch = { newBranch: 5 };
    const result = setObjectPath(o, path, newBranch);

    const clone = easyClone(o);
    expect(o).toEqual(clone);

    clone.fooz.new = newBranch;
    expect(result).toEqual(clone);
  });
});
