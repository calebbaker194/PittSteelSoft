package main;

import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Array;
import java.security.InvalidParameterException;
import java.util.ArrayList;

import javax.swing.JFrame;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JButton;
import javax.swing.JFileChooser;

import java.awt.BorderLayout;
import javax.swing.JPanel;
import javax.swing.SpringLayout;
import javax.swing.JTextField;
import javax.swing.ListCellRenderer;
import javax.swing.ListModel;
import javax.swing.BoxLayout;
import java.awt.FlowLayout;
import javax.swing.SwingConstants;
import java.awt.Component;
import java.awt.FileDialog;

import javax.swing.Box;
import java.awt.GridBagLayout;
import java.awt.GridBagConstraints;
import java.awt.Insets;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.swing.JLabel;

public class Main extends JFrame{
	private JTextField cvnText;
	private JTextField softwarePath;
	private JLabel CVNLabel;
	private JLabel lblDirectory;
	private JPanel panel_1;
	private JList SoftwareList;

	public Main()
	{
		SoftwareList = new JList(directoryList());
		
		InitGui();
	
		SoftwareList.addMouseListener(new MouseAdapter() 
		{
			@Override
			public void mouseClicked(MouseEvent e) {
				if(e.getClickCount() == 2)
				{
					String dirName = SoftwareList.getSelectedValue().toString();
					cvnText.setText(dirName.substring(dirName.toLowerCase().lastIndexOf('\\')+7));
					if(cvnText.getText().indexOf('-') == 0)
						cvnText.setText(cvnText.getText().substring(1));
					
					e.consume();
					if(cvnText.getText().equals(""))
						SelectSoftware(dirName,dirName.toLowerCase().replaceFirst("xtuple-", "xtuple").substring(dirName.toLowerCase().lastIndexOf('\\')+7));
					else
						SelectSoftware(dirName,cvnText.getText());
					
					return;
				}
				else
				{
					e.consume();
					String dirName = SoftwareList.getSelectedValue().toString();
					cvnText.setText(dirName.substring(dirName.toLowerCase().lastIndexOf('\\')+7));
					if(cvnText.getText().indexOf('-') == 0)
						cvnText.setText(cvnText.getText().substring(1));
				}
			}	
		});
		setVisible(true);
	}
	
	private Object[] directoryList(String dir) 
	{
		File Basedir = new File(dir);
		File[] directories = Basedir.listFiles(File::isDirectory);
		ArrayList<File> files= new ArrayList<File>();
		for(File f:directories)
		{
			for(File c:f.listFiles())
			{
				if( (c.getName().equals("xtuple")||c.getName().equals("xtuple.exe")) && c.isFile())
					files.add(f);
			}
		}
		return files.toArray();
	}
	private Object[] directoryList() 
	{
		return directoryList("\\\\PSH1\\Software\\xtuple");
	}

	private void InitGui() {
		setTitle("Xtuple Client Updater");
		setSize(550, 350);
		setLocationByPlatform(true);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		JPanel panel = new JPanel();
		getContentPane().add(panel, BorderLayout.SOUTH);
		GridBagLayout gbl_panel = new GridBagLayout();
		gbl_panel.columnWidths = new int[] {0, 100, 0, 86, 86, 30, 30, 0, 0};
		gbl_panel.rowHeights = new int[]{20, 0};
		gbl_panel.columnWeights = new double[]{0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, Double.MIN_VALUE};
		gbl_panel.rowWeights = new double[]{0.0, Double.MIN_VALUE};
		panel.setLayout(gbl_panel);
		
		CVNLabel = new JLabel("CVN:");
		CVNLabel.setToolTipText("This number needs to be whatever comes after the end of the Xtuple directory\r\nEx. \\Xtuple4.10.1 The CVN woudn be 4.10.1 ");
		GridBagConstraints gbc_CVNLabel = new GridBagConstraints();
		gbc_CVNLabel.anchor = GridBagConstraints.EAST;
		gbc_CVNLabel.insets = new Insets(5, 4, 5, 5);
		gbc_CVNLabel.gridx = 0;
		gbc_CVNLabel.gridy = 0;
		panel.add(CVNLabel, gbc_CVNLabel);
		
		cvnText = new JTextField();
		cvnText.setToolTipText("This number needs to be whatever\r\ncomes after the end of the Xtuple directory\r\nEx. \\Xtuple4.10.1 The CVN would be 4.10.1 ");
		cvnText.setHorizontalAlignment(SwingConstants.LEFT);
		GridBagConstraints gbc_cvnText = new GridBagConstraints();
		gbc_cvnText.fill = GridBagConstraints.BOTH;
		gbc_cvnText.weightx = 1.0;
		gbc_cvnText.insets = new Insets(5, 0, 5, 5);
		gbc_cvnText.gridx = 1;
		gbc_cvnText.gridy = 0;
		panel.add(cvnText, gbc_cvnText);
		cvnText.setColumns(10);
		
		lblDirectory = new JLabel("Directory:");
		GridBagConstraints gbc_lblDirectory = new GridBagConstraints();
		gbc_lblDirectory.insets = new Insets(5, 0, 5, 5);
		gbc_lblDirectory.anchor = GridBagConstraints.EAST;
		gbc_lblDirectory.gridx = 2;
		gbc_lblDirectory.gridy = 0;
		panel.add(lblDirectory, gbc_lblDirectory);
		
		softwarePath = new JTextField();
		GridBagConstraints gbc_softwarePath = new GridBagConstraints();
		gbc_softwarePath.weightx = 400.0;
		gbc_softwarePath.insets = new Insets(5, 0, 5, 5);
		gbc_softwarePath.fill = GridBagConstraints.BOTH;
		gbc_softwarePath.gridwidth = 4;
		gbc_softwarePath.gridx = 3;
		gbc_softwarePath.gridy = 0;
		panel.add(softwarePath, gbc_softwarePath);
		softwarePath.setColumns(10);
		
		JButton softwareSearchBtn = new JButton("Search...");
		GridBagConstraints gbc_softwareSearchBtn = new GridBagConstraints();
		gbc_softwareSearchBtn.insets = new Insets(5, 0, 5, 5);
		gbc_softwareSearchBtn.fill = GridBagConstraints.VERTICAL;
		gbc_softwareSearchBtn.weightx = 1.0;
		gbc_softwareSearchBtn.anchor = GridBagConstraints.WEST;
		gbc_softwareSearchBtn.gridx = 7;
		gbc_softwareSearchBtn.gridy = 0;
		panel.add(softwareSearchBtn, gbc_softwareSearchBtn);
		
		softwarePath.setText("\\\\PSH1\\Software\\xtuple");
		
		panel_1 = new JPanel();
		getContentPane().add(panel_1, BorderLayout.CENTER);
		GridBagLayout gbl_panel_1 = new GridBagLayout();
		gbl_panel_1.columnWidths = new int[]{0, 0};
		gbl_panel_1.rowHeights = new int[]{0, 0};
		gbl_panel_1.columnWeights = new double[]{1.0, Double.MIN_VALUE};
		gbl_panel_1.rowWeights = new double[]{1.0, Double.MIN_VALUE};
		panel_1.setLayout(gbl_panel_1);
		
		GridBagConstraints gbc_SoftwareList = new GridBagConstraints();
		gbc_SoftwareList.fill = GridBagConstraints.BOTH;
		gbc_SoftwareList.gridx = 0;
		gbc_SoftwareList.gridy = 0;
		panel_1.add(SoftwareList, gbc_SoftwareList);
	}

	public void SelectSoftware(String path,String CVN)
	{
		Object[] options = {"Proceed","Cancel"};
		int proceed=JOptionPane.showOptionDialog(this,"Waring: By proceding you could change the Xtuple client on the local network" , "Confirmation", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]);
		if(proceed==0)
		{
			System.out.println("Proceed");
			FileDialog updateFileChooser = new FileDialog(this,"Save as",FileDialog.SAVE);
			updateFileChooser.setDirectory("\\\\PSH1\\Software\\xtuple\\XtupleUpdate");
			updateFileChooser.setFile("*.txt");
			updateFileChooser.setVisible(true);
			String updateFile =updateFileChooser.getDirectory() + updateFileChooser.getFile();
			
			proceed=JOptionPane.showOptionDialog(this,"You Are about to update the Xtuple Client to "+path+" With a CVN of: "+CVN+"\n Are you Sure you want to continue" , "Confirmation", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]);
			if(proceed==0)
			{
				if(CVN.indexOf(':') + path.indexOf(':') + CVN.indexOf('=') + path.indexOf('=') > -4)
				{
					throw new InvalidParameterException("Your Path and CVN Must not contain : or =");
				}
				try {
					System.out.println(updateFile);
					PrintWriter fw = new PrintWriter(updateFile);
					fw.println("CVN:"+CVN+": Software="+path);
					fw.close();
					System.out.println("Xtuple will update at 6:00 PM Today \n A log of that update will appear in \n\\\\PHS1\\Documents\\IT\\");
				} catch (IOException e) {
					e.printStackTrace();
					return;
				}
			}
		}
	}
	
	public static void main(String args[]) throws Exception
	{
		new Main(); 
	}
}
