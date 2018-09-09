import { expect } from 'chai';
import assemblerInterpreter from '../assembler.js';

const programs = [
`mov  a, 5
msg a
end` //0
,
`mov  a, 5
mov  b, a
msg b
end` //1
,
`mov  a, 5
inc a
msg a
end` //2
,
`mov  a, 5
dec a
msg a
end` //3
,
`mov  a, 5
add a, 5
msg a
end` //4
,
`mov  a, 5
mov  b, 5
add a, b
msg a
end` //5
,
`mov  a, 5
sub a, 5
msg a
end` //6
,
`mov  a, 5
mov  b, 5
sub a, b
msg a
end` //7
,
`mov  a, 5
mul a, 5
msg a
end` //8
,
`mov  a, 5
mov  b, 5
mul a, b
msg a
end` //9
,
`mov  a, 5
div a, 5
msg a
end` //10
,
`mov  a, 5
mov  b, 5
div a, b
msg a
end` //11
,
`mov  a, 5
jmp label
inc  a
label:
    inc  a
msg a
end` //12
,
`cmp  5, 6
jne label
msg 'equal'
end

label:
    msg 'not equal'
    end
`//13
,
`cmp  5, 5
jne label
msg 'equal'
end

label:
    msg 'not equal'
    end
`//14
,
`cmp  5, 6
je label
msg 'not equal'
end

label:
    msg 'equal'
    end
`//15
,
`cmp  5, 5
je label
msg 'not equal'
end

label:
    msg 'equal'
    end
`//16
,
`cmp  5, 4
jge label
msg 'lesser'
end

label:
    msg 'greater or equal'
    end
`//17
,
`cmp  5, 6
jge label
msg 'lesser'
end

label:
    msg 'greater or equal'
    end
`//18
,
`cmp  5, 4
jg label
msg 'lesser or equal'
end

label:
    msg 'greater'
    end
`//19
,
`cmp  5, 6
jg label
msg 'lesser or equal'
end

label:
    msg 'greater'
    end
`//20
,
`cmp  5, 4
jle label
msg 'greater'
end

label:
    msg 'lesser or equal'
    end
`//21
,
`cmp  5, 6
jle label
msg 'greater'
end

label:
    msg 'lesser or equal'
    end
`//22
,
`cmp  5, 4
jle label
msg 'greater or equal'
end

label:
    msg 'lesser'
    end
`//23
,
`cmp  5, 6
jle label
msg 'greater or equal'
end

label:
    msg 'lesser'
    end
`//24
,
`call sub
msg ' and got back'
end

sub:
    msg 'called'
    ret
`//25
,
`msg 'msg'; , 777
end`//26
];

const programMod = (
`mov   a, 11           ; value1
mov   b, 3            ; value2
call  mod_func
msg   'mod(', a, ', ', b, ') = ', d        ; output
end

; Mod function
mod_func:
    mov   c, a        ; temp1
    div   c, b
    mul   c, b
    mov   d, a        ; temp2
    sub   d, c
    ret`
);

describe('unitary instructions tests', () => {

    describe('mov', () => {

        it('should copy literal value to register', () => {
            const res = assemblerInterpreter(programs[0]);

            expect(res).to.equal('5');
        });

        it('should copy value of register to register', () => {
            
            const res = assemblerInterpreter(programs[1]);

            expect(res).to.equal('5');
        });

    });

    describe('inc', () => {

        it('should increment value of register', () => {
            const res = assemblerInterpreter(programs[2]);

            expect(res).to.equal('6');
        });

    });

    describe('dec', () => {

        it('should decrement value of register', () => {
            const res = assemblerInterpreter(programs[3]);

            expect(res).to.equal('4');
        });

    });

    describe('add', () => {

        it('should add literal value to register', () => {
            const res = assemblerInterpreter(programs[4]);

            expect(res).to.equal('10');
        });

        it('should add value of register to register', () => {
            const res = assemblerInterpreter(programs[5]);

            expect(res).to.equal('10');
        });

    });

    describe('sub', () => {

        it('should subtract literal value to register', () => {
            const res = assemblerInterpreter(programs[6]);

            expect(res).to.equal('0');
        });

        it('should subtract value of register to register', () => {
            const res = assemblerInterpreter(programs[7]);

            expect(res).to.equal('0');
        });

    });

    describe('mul', () => {

        it('should multiply literal value to register', () => {
            const res = assemblerInterpreter(programs[8]);

            expect(res).to.equal('25');
        });

        it('should multiply value of register to register', () => {
            const res = assemblerInterpreter(programs[9]);

            expect(res).to.equal('25');
        });

    });

    describe('div', () => {

        it('should divide literal value to register', () => {
            const res = assemblerInterpreter(programs[10]);

            expect(res).to.equal('1');
        });

        it('should divide value of register to register', () => {
            const res = assemblerInterpreter(programs[11]);

            expect(res).to.equal('1');
        });

    });

    describe('jmp', () => {

        it('should jump to an unknown label', () => {
            const res = assemblerInterpreter(programs[12]);
            expect(res).to.equal('6');
        });

    });

    describe('jne', () => {

        it('should jump to label if compared values were not equal', () => {
            const res = assemblerInterpreter(programs[13]);
            expect(res).to.equal('not equal');
        });

        it('should not jump to label if compared values were equal', () => {
            const res = assemblerInterpreter(programs[14]);
            expect(res).to.equal('equal');
        });

    });

    describe('je', () => {

        it('should not jump to label if compared values were not equal', () => {
            const res = assemblerInterpreter(programs[15]);
            expect(res).to.equal('not equal');
        });

        it('should jump to label if compared values were equal', () => {
            const res = assemblerInterpreter(programs[16]);
            expect(res).to.equal('equal');
        });

    });

    describe('jge', () => {

        it('should jump to label if x was greater or equal than y', () => {
            const res = assemblerInterpreter(programs[17]);
            expect(res).to.equal('greater or equal');
        });

        it('should not jump to label if x was not greater or equal than y', () => {
            const res = assemblerInterpreter(programs[18]);
            expect(res).to.equal('lesser');
        });

    });

    describe('jg', () => {

        it('should jump to label if x was greater than y', () => {
            const res = assemblerInterpreter(programs[19]);
            expect(res).to.equal('greater');
        });

        it('should not jump to label if x was not greater than y', () => {
            const res = assemblerInterpreter(programs[20]);
            expect(res).to.equal('lesser or equal');
        });

    });

    describe('jle', () => {

        it('should not jump to label if x was not lesser or equal than y', () => {
            const res = assemblerInterpreter(programs[21]);
            expect(res).to.equal('greater');
        });

        it('should jump to label if x was lesser or equal than y', () => {
            const res = assemblerInterpreter(programs[22]);
            expect(res).to.equal('lesser or equal');
        });

    });

    describe('jl', () => {

        it('should not jump to label if x was not lesser than y', () => {
            const res = assemblerInterpreter(programs[23]);
            expect(res).to.equal('greater or equal');
        });

        it('should jump to label if x was lesser than y', () => {
            const res = assemblerInterpreter(programs[24]);
            expect(res).to.equal('lesser');
        });

    });

    describe('call and ret', () => {

        it('should call subroutine', () => {
            const res = assemblerInterpreter(programs[25]);
            expect(res).to.equal('called and got back');
        });

    });

    describe('comment', () => {

        it('should ignore comment', () => {
            const res = assemblerInterpreter(programs[26]);
            expect(res).to.equal('msg');
        });

    });
});

describe('code wars tests', ()=>{

    it('should should', () => {
        const res = assemblerInterpreter(programMod);
        expect(res).to.equal('mod(11, 3) = 2');
    });
})