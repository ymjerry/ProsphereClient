
Partial Class DealerLanding
    Inherits System.Web.UI.Page

    Protected Sub form1_Load(sender As Object, e As EventArgs) Handles form1.Load

    End Sub

    Protected Sub SqlDataSource1_Init(sender As Object, e As EventArgs) Handles SqlDataSource1.Init
        If (Request("saveCode") <> "") Then
            SqlDataSource1.SelectParameters("RetrievalCode").DefaultValue = Request("saveCode").ToString.Replace(Chr(34), "")
        End If
    End Sub

End Class
