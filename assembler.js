const parseArgs = (argsStr) => {
    const regex = /'[^']*'|[^ ,]+/g, args = [];
    let match;
    while((match = regex.exec(argsStr)) !== null){
        args.push(match[0]);
    }
    return args;
}

const parseLine = (lineStr) => {
    const tl = lineStr.trim();
    const trimmedLine = tl.indexOf(';') !== -1 ? tl.slice(0,tl.indexOf(';')) : tl;
    const idx = trimmedLine.indexOf(" ");

    const cmd = trimmedLine.slice(0,idx === -1 ? undefined : idx);
    const args = idx === -1 ? [] : parseArgs(trimmedLine.slice(idx+1));

    return [ cmd , args ];
}

const assemblerInterpreter = (program) => {
    const lines = program.split('\n').map(line =>  parseLine(line));

    let curr, out = '', compare = 0;
    const reg = {}, labels = {}, callStack = [];
    const getValue = (value) => reg[value] !== undefined ? reg[value] : +value;
    const getStringValue = (value) => reg[value] !== undefined ? reg[value] : value.slice(1,-1);
    const getLabel = (label) => {
        if(labels[label] === undefined)
            labels[label] = lines.findIndex((line)=>label === line[0].slice(0,-1));
        return labels[label];
    };

    for (let i=0; i<lines.length; i++){
        const line = lines[i];
        const [ cmd, args ] = line;
        switch(cmd) {
            case 'mov': {
                reg[args[0]] = getValue(args[1]);
                break;
            };
            case 'inc': {
                reg[args[0]]++;
                break;
            };
            case 'dec': {
                reg[args[0]]--;
                break;
            };
            case 'add': {
                reg[args[0]] += getValue(args[1]);;
                break;
            };
            case 'sub': {
                reg[args[0]] -= getValue(args[1]);;
                break;
            };
            case 'mul': {
                reg[args[0]] *= getValue(args[1]);;
                break;
            };
            case 'div': {
                reg[args[0]] = Math.floor(reg[args[0]]/getValue(args[1]));
                break;
            };
            case /^[.*]:$/.test(cmd): {
                labels[cmd.slice(0,-1)] = i;
                break;
            };
            case 'jmp': {
                i = getLabel(args[0]);
                break;
            };
            case 'cmp': {
                compare = getValue(args[0]) - getValue(args[1]);
                break;
            };
            case 'jne': {
                if(compare !== 0)
                    i = getLabel(args[0]);
                break;
            };
            case 'je': {
                if(compare === 0)
                    i = getLabel(args[0]);
                break;
            };
            case 'jge': {
                if(compare >= 0)
                    i = getLabel(args[0]);
                break;
            };
            case 'jg': {
                if(compare > 0)
                    i = getLabel(args[0]);
                break;
            };
            case 'jle': {
                if(compare <= 0)
                    i = getLabel(args[0]);
                break;
            };
            case 'jl': {
                if(compare < 0)
                    i = getLabel(args[0]);
                break;
            };
            case 'call': {
                callStack.push(i);
                i = getLabel(args[0]);
                break;
            };
            case 'ret': {
                i = callStack.pop();
                break;
            };
            case 'msg': {
                args.forEach((arg)=> {
                    out += getStringValue(arg);
                });
                break;
            };
            case 'end': {
                return out;
            };
        }
    }
    return -1;
};

export default assemblerInterpreter;