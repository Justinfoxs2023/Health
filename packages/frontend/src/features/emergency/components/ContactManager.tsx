export const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  const addContact = async (contact: Partial<EmergencyContact>) => {
    try {
      const newContact = await createEmergencyContact(contact);
      setContacts(prev => [...prev, newContact]);
      Toast.show({
        type: 'success',
        text: '添加成功'
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View style={styles.container}>
      <ContactList
        contacts={contacts}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <AddContactForm onSubmit={addContact} />
    </View>
  );
}; 