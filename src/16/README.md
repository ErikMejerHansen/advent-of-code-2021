## The Parser State-Machine

This solution is overly complicated, but state machines are fun :)

![State machine](parser-state-machine.png)

```dot
digraph G {

  bgcolor=transparent;


  start -> "Parse Version";
  start -> end [label="End of input"]
  "Parse Version" -> "Parse Type"
  "Parse Type"-> "Parse Literal" [label=" type is 4"]
  "Parse Type"->"Parse Operator" [label=" type is not 4"]
  "Parse Literal" -> "Parse Group"
  "Parse Group" -> "Parse Group" [label=" leading bit is 1"]
  "Parse Group" -> "Parse Version" [label=" leading bit is 0"]
  "Parse Operator" -> "Parse Length Type"
  "Parse Length Type" -> "Parse Subpackets length 15" [label="Length type is 10"]
  "Parse Length Type" -> "Parse Subpackets length 11" [label="Length type is 1"]
  "Parse Subpackets length 15" -> "Parse Version"
  "Parse Subpackets length 11" -> "Parse Version"
  start [shape=Mdiamond];
  end [shape=Msquare];
}
```
