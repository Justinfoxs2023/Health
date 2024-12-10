// 健康目标设置组件
export const GoalSetter: React.FC<GoalSetterProps> = ({
  currentGoal,
  onGoalSet
}) => {
  const [goal, setGoal] = useState(currentGoal);
  
  return (
    <Card className="goal-setter">
      <CardHeader title="设置目标" />
      <CardContent>
        <Slider
          value={goal}
          onChange={(_, value) => setGoal(value)}
          marks
          min={0}
          max={100}
        />
        <Button
          variant="contained"
          onClick={() => onGoalSet(goal)}
        >
          保存目标
        </Button>
      </CardContent>
    </Card>
  );
};

// 数据输入表单
export const HealthDataForm: React.FC<DataFormProps> = ({
  fields,
  onSubmit
}) => {
  const [formData, setFormData] = useState({});
  
  return (
    <Form onSubmit={() => onSubmit(formData)}>
      {fields.map(field => (
        <TextField
          key={field.key}
          label={field.label}
          type={field.type}
          value={formData[field.key]}
          onChange={e => setFormData({
            ...formData,
            [field.key]: e.target.value
          })}
        />
      ))}
      <Button type="submit">提交</Button>
    </Form>
  );
}; 