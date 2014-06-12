<%@ Page Language="VB" AutoEventWireup="false" CodeFile="DealerLanding.aspx.vb" Inherits="DealerLanding" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="Data Source=184.169.129.35;Initial Catalog=ProsphereCMS;Persist Security Info=True;User ID=sa;Password=Ktxt0pscan" ProviderName="System.Data.SqlClient" SelectCommand="SELECT [UniformConfiguration] FROM [DealerSavedCustomizations] WHERE ([RetrievalCode] = @RetrievalCode)">
            <SelectParameters>
                <asp:Parameter Name="RetrievalCode" Type="String" DefaultValue="RC3AC6C0064F" />
            </SelectParameters>
        </asp:SqlDataSource>
        <br />
        <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" DataSourceID="SqlDataSource1">
            <Columns>
                <asp:TemplateField HeaderText="UniformConfiguration" SortExpression="UniformConfiguration">
                    <EditItemTemplate>
                        <asp:TextBox ID="TextBox1" runat="server" Text='<%# Bind("UniformConfiguration") %>'></asp:TextBox>
                    </EditItemTemplate>
                    <ItemTemplate>
                        <asp:Textbox ID="Label1" runat="server" Text='<%# System.Xml.Linq.XDocument.Parse(Eval("UniformConfiguration").ToString).ToString()%>' TextMode="MultiLine" Rows="50" Width="1024"></asp:Textbox>
                    </ItemTemplate>
                </asp:TemplateField>
            </Columns>
        </asp:GridView>
    
    </div>
    </form>
</body>
</html>


